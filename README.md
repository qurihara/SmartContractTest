# Solidityによるスマートコントラクト演習
## NFTを作ってみる

以下の記事に従ってイーサリアムと互換性のあるPolygonとう暗号通貨ブロックチェーンを使ってNFTを作り、送り合うという演習をします。

https://qiita.com/somk_2301/items/1d36522698e56b1cf22c

今回使うのは、「テストネット」という開発用のブロックチェーン環境です。本物を「メインネット」と呼んで区別します。スマートコントラクトは実行したりするのに暗号通貨を消費します。暗号通貨は資産価値があり有料ですが、テストネット用の暗号通貨は無料配布されています。つまり、動かすコードは同じですが、テストネットは無料で何でもできるのに対し、メインネットは扱うのにはお金がかかるということです。
この記事はイーサリアムのテストネットであるSepoliaを使う前提で書かれてますが、我々が行なうのはPolygonのテストネットであるAmoyを使います。何を言っているかわからない方はとりあえず無視してOKです。

# 事前準備（当日の演習にむけ、ここまで準備していただけるとありがたいです）

まずmacのターミナルでいろいろ作業するので、以下を準備します。すでにご自身のPCにセットアップされている場合は飛ばしてください。

* macのパッケージマネージャーhomebrewのインストール
https://brew.sh/ja/


```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

* ソースコード管理ツール gitのインストール

もしgitがインストールされていなければインストールします

```shell
brew install git
```

* nodeのバージョン管理ツールnodebrewとnode.jsのインストール

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

```shell
git clone https://github.com/qurihara/SmartContractTest.git
cd SmartContractTest
```

開発準備は終了です。次はブラウザで各種準備をします。

## metamaskのインストール

https://metamask.io/ja/download/

metamaskはイーサリアム系の暗号通貨のウォレット（口座、おさいふ、あるいはアカウント管理ツール）です。暗号通貨やNFTなどを所持、表示、送受信できます。
chrome版をインストールしてアカウントを作りましょう。スマートフォンアプリもありますので後でchrome版のアカウントと同期すると良いと思いますが、開発する上ではchrome版がいろいろ楽ですのでこちらを基本は使います。
ウォレットをつくると、「秘密鍵」という文字列が得られます。これがあなたの口座のパスワードであり、知られると誰でもあなたになりすまして口座から入出金できるようになってしまいます。今回の演習では実際に価値のある暗号通貨やNFTは扱わないので安全ですが、この文字列の扱いには気をつけましょう。

## Archemyのアカウント作成

https://auth.alchemy.com/signup

Archemyはブロックチェーンのネットワークへの面倒なアクセスを、我々に馴染み深い言語（Node.jsとかPythonとかWebsocketとか）でできるようにしてくれる仲介サービスです。無料のフリープランでアカウントを作ります。電話番号での認証が必要です。

## Discordへのアカウント登録

テスト用の暗号通貨を配布してもらうためにはDiscordのアカウントとインストールが必要なので、下記で行います。

https://support.discord.com/hc/ja/articles/360034561191-%E3%83%87%E3%82%B9%E3%82%AF%E3%83%88%E3%83%83%E3%83%97%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%82%AC%E3%82%A4%E3%83%89


# 以後は、事前にやっておいてくれると嬉しいけど、つまる可能性がある作業

## metamask にPOLとAmoyを追加する

metamaskはデフォルトではイーサリアムの管理をしますが、他の暗号通貨を追加することでそれも扱えるようになります。
* https://note.com/standenglish/n/n5212eabc40ad
* https://polygon.technology/blog/introducing-the-amoy-testnet-for-polygon-pos

を参考に、自分のmetamaskで少なくともAmoyを追加し、表示できるようにします。

## PolygonのFaucetからテストネット用の暗号通貨POLをもらう

Faucetは「蛇口」です。開発用に、無価値な暗号通貨である「テストネット用POL」を蛇口から分けてもらいます。

https://faucet.polygon.technology/

* Networkで　PolygonPos (Amoy)を選択
* Wallet Address　にmetamaskのAmoyの自分の秘密鍵をコピーアンドペーストする
* Connect Discord and get tokensを押す。
* 最初はなぜかうまくいかなかったけど、何度が繰り返すとうまくいきました。

metamaskで、もらったテストネット用POLの残高が増えていることを確認してください。

# ここからが実際の作業

## Archemyでプロジェクトをつくる

下記を参考に
https://docs.alchemy.com/docs/how-to-deploy-a-smart-contract-to-the-sepolia-testnet



