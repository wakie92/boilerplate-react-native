# boilerplate-react-native

## Prerequisite

- Node version: 20.10.0
- ios
- cocoapods ($ brew install cocoapods -v 1.11.2)
- XCode (https://apps.apple.com/kr/app/xcode/id497799835?mt=12)
- Android
  - JAVA(openjdk@17)
    - `brew install openjdk@17`
  - Gradle
  - Android API 34
  - Android Studio (https://developer.android.com/studio)
- Eslint linting

## Create new project

- Change all of the app name is already set to new project name
  - File name (ex: ios/feMonopolyApp -> ios/{NEW_PROJECT_NAME})
  - Name (ex: package.json - "name": "feMonopolyApp" -> "name": "{NEW_PROJECT_NAME}")

## Init

```
# On Project Root
- pnpm install
- npx pod-install

cd android
- ./gradlew clean
-  ./gradlew install

# On Project Root
- pnpm run dev
```

### Build

- Android

```
$ cd android
$ ./gradlew clean
$ ./gradlew install

# On Project Root
$ pnpm run android

```

- iOS

```
# On Project Root
$ npx pod-install
$ pnpm run ios
```

# Add Env variable `~/.zshrc` or terminal rc file

```
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export JAVA_HOME

export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
```

# Run

$ source ~/.zshrc

```

```
