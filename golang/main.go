package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
)

func main() {
	if len(os.Args) <= 1 || matchInSliceElements(os.Args[1:], `^(--help|-help|-h)$`) {
		fmt.Println(`Syntax:
		pnpm-cra <app_name> <lang>
	
		app_name : (REQUIRED) name of app or directory name
		lang     : (OPTIONAL) ts | --ts | --typescript | typescript
		
		app_name directory can exist already
		default lang = js, no need to specify
		`)

		os.Exit(-1)
	}

	dir := os.Args[1]
	userArgs := os.Args[2:]

	// ================================================================================

	appName, err := filepath.Abs(dir)
	checkError(err, "Invalid directory name")

	packageJsonFilePath := filepath.Join(appName, "package.json")
	language := getLanguage(userArgs)

	__dirname, err := getWd()
	checkError(err, "Cannot get __dirname")

	filesToCopyFromPath := filepath.Join(__dirname, "files")

	// ================================================================================
	checkError(
		createFolder(appName),
		"Cannot create app directory",
	)
	checkError(os.Chdir(appName), "")

	// ================================================================================

	// create package.json
	if checkIfPathExist(packageJsonFilePath) {
		fmt.Printf("%q already exists. Delete it first")
		os.Exit(-1)
	}

	err = writeFileIfNotExist(
		packageJsonFilePath,
		filepath.Join(filesToCopyFromPath, "package.json"),
		"",
	)
	checkError(err, "package.json could not be created")

	// ================================================================================

	// npm init
	stdout, err := exec.Command("npm", "init", "-y").Output()
	checkError(err, "npm init failed")
	fmt.Println(string(stdout))

	// ================================================================================

	// create src & public directories
	checkError(createFolder("src"), "")
	checkError(createFolder("public"), "")

	// ================================================================================

	// create .gitignore
	err = writeFileIfNotExist(
		packageJsonFilePath,
		filepath.Join(filesToCopyFromPath, "package.json"),
		"",
	)
	checkError(err, "package.json could not be created")
}

func matchInSliceElements(arr []string, pattern string) (res bool) {
	for _, v := range arr {
		matched, _ := regexp.MatchString(pattern, v)
		if matched {
			return true
		}
	}

	return false
}

func getLanguage(userArgs []string) string {
	if matchInSliceElements(userArgs, `^(ts|--ts|--typescipt|typescript)$`) {
		return "typescript"
	}

	return "javascript"
}

func getWd() (string, error) {
	ex, err := os.Executable()
	if err != nil {
		return "", err
	}
	ex, err = filepath.EvalSymlinks(ex)
	if err != nil {
		return "", err
	}

	exPath := filepath.Dir(ex)
	return exPath, nil
}

func checkError(err error, message string, toPanic bool) {
	if err != nil {
		fmt.Println(message)
		if toPanic
		panic(err)
	}
}

func checkIfPathExist(path string) bool {
	_, err := os.Stat(path)
	return os.IsExist(err)
}

func writeFileIfNotExist(dst, srcFile, data string) error {
	if !checkIfPathExist(dst) {
		in, err := os.Open(srcFile)
		if err != nil {
			return err
		}
		defer in.Close()

		if srcFile != "" {
			out, err := os.Create(dst)
			if err != nil {
				return err
			}
			defer out.Close()

			_, err = io.Copy(out, in)
			if err != nil {
				return err
			}
			return out.Close()
		}

		err = os.WriteFile(
			dst,
			[]byte(data),
			0777,
		)
		checkError(err, "")
	}
}

func createFolder(path string) error {
	return os.MkdirAll(path, 0777)
}
