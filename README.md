# Solidityによるスマートコントラクト演習
## NFTを作ってみる

以下の記事に従ってイーサリアムと互換性のあるPolygonとう暗号通貨ブロックチェーンを使ってNFTを作り、送り合うという演習をします。

https://qiita.com/somk_2301/items/1d36522698e56b1cf22c

まずmacのターミナルでいろいろ作業するので、以下を準備します。すでにご自身のPCにセットアップされている場合は飛ばしてください。

* macのパッケージマネージャーhomebrewのインストール
https://brew.sh/ja/


```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

* gitのインストール

もしgitがインストールされていなければインストールします

```shell
brew install git
```



* Nodebrewとnode.jsのインストール

https://qiita.com/kiharito/items/4785d4d54c967b8ddc9a

```shell
brew install nodebrew
nodebrew setup
export PATH=$HOME/.nodebrew/current/bin:$PATH
source ~/.zshrc
nodebrew install-binary stable
nodebrew ls
```

インストールされたバージョンのnode.jsを以下のコマンドで使います。v18.16.0のところを、表示されたバージョン番号に変えて実行してください。


```shell
nodebrew use v18.16.0
node　-v
```

今回準備したサンプルプロジェクトをgit cloneします。


