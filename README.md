# Solidityによるスマートコントラクト演習
## NFTを作ってみる

以下の記事を参考にしてイーサリアムと互換性のあるPolygonとう暗号通貨ブロックチェーンを使ってNFTを作り、送り合うという演習を想定して手順を書きます。

https://qiita.com/somk_2301/items/1d36522698e56b1cf22c

今回使うのは、「テストネット」という開発用のブロックチェーン環境です。本物を「メインネット」と呼んで区別します。スマートコントラクトは実行したりするのに暗号通貨を消費します。暗号通貨は資産価値があり有料ですが、テストネット用の暗号通貨は無料配布されています。つまり、動かすコードは同じですが、テストネットは無料で何でもできるのに対し、メインネットは扱うのにはお金がかかるということです。
この記事はイーサリアムのテストネットであるSepoliaを使う前提で書かれてますが、今回はPolygonのテストネットであるAmoyを使います。何を言っているかわからない方はとりあえず無視してOKです。

# 事前準備（演習時の時間短縮のため、事前に行いましょう。）

# コードエディタの準備

開発用のコードエディタを準備します。AI支援で快適なcursorか、その土台となった多機能エディタのvisual studio codeのどちらかがよいと思いますのでインストールしてください。私はcursorを使ってます。

* https://www.cursor.com/
* https://code.visualstudio.com/

次にmacのターミナルでいろいろ作業するので、以下を準備します。すでにご自身のPCにセットアップされている場合は飛ばしてください。

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
nodebrew install-binary v20.11.0
nodebrew ls
```

インストールされたバージョンのnode.jsを以下のコマンドで使います。


```shell
nodebrew use v20.11.0
node　-v
```

（現在私はv20.11.0とv22.13.0で動作確認しています。）

今回準備したサンプルプロジェクトをgit cloneします。

```shell
git clone https://github.com/qurihara/SmartContractTest.git
cd SmartContractTest
```

今回準備したサンプルプロジェクトのセットアップをします。

```shell
npm install
```

開発環境を確認するために、ためしに以下を実行してみます。

```shell
npx hardhat
```

以下のようにhardhatというツールについてのヘルプ情報が表示されていればOKです。バージョン情報は私の環境のものですので、皆さんの番号は違うかも知れません。

```shell
Hardhat version 2.22.17
（以下略）
```

開発準備は終了です。次はブラウザで各種準備をします。

## metamaskのインストール

https://metamask.io/ja/download/

metamaskはイーサリアム系の暗号通貨のウォレット（口座、おさいふ、あるいはアカウント管理ツール）です。暗号通貨やNFTなどを所持、表示、送受信できます。
chrome版をインストールしてアカウントを作りましょう。スマートフォンアプリもありますので後でchrome版のアカウントと同期すると良いと思いますが、開発する上ではchrome版がいろいろ楽ですのでこちらを基本は使います。
ウォレットをつくると、「秘密鍵」という文字列が得られます。これがあなたの口座のパスワードであり、知られると誰でもあなたになりすまして口座から入出金できるようになってしまいます。今回の演習では実際に価値のある暗号通貨やNFTは扱わないので安全ですが、この文字列の扱いには気をつけましょう。

## Alchemyのアカウント作成

https://auth.alchemy.com/signup

Alchemyはブロックチェーンのネットワークへの面倒なアクセスを、我々に馴染み深い言語（Node.jsとかPythonとかWebsocketとか）でできるようにしてくれる仲介サービスです。無料のフリープランでアカウントを作ります。電話番号での認証が必要です。

## Discordへのアカウント登録

テスト用の暗号通貨を配布してもらうためにはDiscordのアカウントとインストールが必要なので、下記で行います。

https://support.discord.com/hc/ja/articles/360034561191-%E3%83%87%E3%82%B9%E3%82%AF%E3%83%88%E3%83%83%E3%83%97%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%82%AC%E3%82%A4%E3%83%89


# 以後は、事前にやっておいたほうが望ましいけど、つまる可能性がある作業なので、難しい場合は演習当日に進めるのでもOKな項目です。

## metamask にPOLとAmoyを追加する

metamaskはデフォルトではイーサリアムの管理をしますが、他の暗号通貨を追加することでそれも扱えるようになります。
* https://note.com/standenglish/n/n5212eabc40ad
* https://polygon.technology/blog/introducing-the-amoy-testnet-for-polygon-pos

を参考に、自分のmetamaskで少なくともAmoyを追加し、表示できるようにします。

## PolygonのFaucetからテストネット用の暗号通貨POLをもらう

Faucetは「蛇口」です。開発用に、無価値な暗号通貨である「テストネット用POL」を蛇口から分けてもらいます。1回で0.2POLもらえます。1日1回くらいしかもらえないと思います。意外と枯渇しやすいです。まとまった量のPOLをもらえるフォームもあり、私はこれで一括で100POLいただきました😊（イーサリアムのテストネットのSepolia用の通貨もくれる蛇口があるのですが、こちらは本物のメインネット仮想通貨を少量持っていないと使えない制限があるみたいです。）


https://faucet.polygon.technology/


* Networkで　PolygonPos (Amoy)を選択
* Wallet Address　にmetamaskのAmoyの自分の秘密鍵をコピーアンドペーストする
* Connect Discord and get tokensを押す。
* 最初はなぜかうまくいかなかったけど、何度が繰り返すとうまくいきました。


metamaskで、もらったテストネット用POLの残高が増えていることを確認してください。

# ここからが実際の作業

## Alchemyでプロジェクトをつくる

下記を参考にします。ただし、この記事はイーサリアムのテストネットであるsepoliaを用いるプロジェクトですが、今回はPolygonのテストネットであるAmoyを用いるプロジェクトなので、選択を間違えないようにします。

https://docs.alchemy.com/docs/how-to-deploy-a-smart-contract-to-the-sepolia-testnet

（私自身が本教材作成時にどう選択したか覚えていないので、演習時に確認しながら進めましょう）

一番重要なのは、プロジェクトの API Key という文字列を取得することです。そこまで進んだら、あとは上記ドキュメントは不要です。

## ターミナルで秘密鍵とAPI Keyを設定する

ターミナルで、現在作業しているSmartContractTestのディレクトリ内で以下を実行し、metamaskの秘密鍵とAlchemyのAPI Keyを入力します。これにより、ソースコード内に機密情報を書かなくて済むので、安全に開発できます。

```shell
npx hardhat vars set ALCHEMY_API_KEY
√ Enter value: · {API KEYを入力}
```


```shell
npx hardhat vars set ACCOUNT_PRIVATE_KEY
√ Enter value: · {秘密鍵を入力}
```
## スマートコントラクトを書く

contracts/MyNft.solをコードエディタで開きます。Solidityという言語でスマートコントラクトは記述します。Javaっぽい文法で、理解にはオブジェクト指向的な知識が必要です。
かいつまんで話すと、ERC721というのがNFTの仕様で、すでに偉い人が雛形を作ってありますので、ERC721の雛形を土台にして、自分だけのNFTを作ります。


```shell
  constructor() ERC721("KuriNFT", "KNFT") Ownable(msg.sender) // ここがポイント！
```
ここでKuriNFTとKNFTのところを好きな文字列に変えましょう。最初が正式名称、次が略称です。

```shell
npx hardhat compile
```

コンパイルが無事できたでしょうか。

## テストする

OKならテストを実行し、問題ないことを確認します。

```shell
npx hardhat test
```
エラーがでましたよね。問題ないです。
テストコードはtestフォルダにあり、NFTとして備えるべき一般的な性質を満たしているかがテストされます。（たとえば、オーナーしかつくることができないとか、送付時に所有権が適切に移るとか。これは本来は自分で書きます。）

test/MyNft.jsをコードエディタで開いて、KuriNFT、KNFTと書かれているところを先程決めた自分の文字列に変えて保存し、再度テストしてみてください。テストが成功すると思います。

## ローカルネットワークでデプロイ

次にローカルネットワークにデプロイ（≒ブロックチェーンに載せて実行する）します。ローカルネットワークというのはあなたのPC上に作られた自分だけのテスト環境です。テストネットとはちがいます。テストネットは世界に一つしかありません。ローカルネットワークはあなたのPC上にあり、いくらでも作れます。何をやってもOKです。

```shell
npx hardhat run scripts/deploy.js
```
deployedと表示されれば成功です。
scripts/deploy.jsをコードエディタで見てみましょう。Alchemyのおかげで、簡単にデプロイできています。

## テストネットでデプロイ

いよいよテストネットにデプロイします。これは自分の口座のテストネットPOLを消費します。

```shell
npx hardhat run scripts/NewTokenDeploy.js --network polygonAmoy
```
私の環境で0.019POL消費しました。

## ブロックチェーン上に書き込まれたこと（トランザクション）の確認

metamaskで「エクスプローラーで表示」をクリック。いまデプロイした履歴がそこに書き込まれています（超地味な感動ポイント😊）！

次の作業のため、contract creationをクリックして、コントラクトアドレスを取得します。
![コントラクトアドレス](https://i.gyazo.com/d7ff99d24672a8775c6d256e93e27521.png)

```shell
npx hardhat vars set CONTRACT_ADDRESS
```
コントラクトアドレスを追加してください。これは、今後プログラムから「すでに実行したNFTの定義をつかってNFT操作関数を実行する」のような作業のための準備です。

## NFTをつくる

次にNFTを鋳造（mint）します。金貨の発行みたいなニュアンスです。
scripts/mint.js を見てみましょう。

```shell
const tokenId = 0;
```

のtokenIdが鋳造するNFTのIDです。（一度作ったら、次は1などにしないといけません。）

ローカルネットでテストします。

```shell
npx hardhat run scripts/mint.js 
```

テストネットにデプロイします。

```shell
npx hardhat run scripts/mint.js --network polygonAmoy
```

## metamaskでNFTを表示

metamaskでNFTをインポートし表示させます。

NFTをインポートします。ネットワーク（左上）をAmoyにして、「トークンのインポート」をします。トークンのインポートは、以下画像の中央右の「てんてんてん」をクリックすると可能です。
![NFTのインポート](https://i.gyazo.com/8448bbc1441ff13d496631c885b1c284.png)

ここで必要になるアドレスは、「エクスプローラーで表示」でmint実行した履歴のToの値です。Token IDはTransaction Hashをクリックすると開く詳細に書いてあります。

無事NFTとともに画像が表示されれば完了！（地味な感動ポイント😊）
他の方にNFTを送ってみましょう！

ほぼ同じ手順で、NFTだけでなく自分独自の暗号通貨も作れます。

## OpenSea（テストネット版）で表示、販売

OpenSeaは業界最大手のNFT流通サービスです。metamaskにアカウントがあれば、OpenSea側でアカウントを使わなくてもすぐに利用可能になります。また、テストネット用のOpenSeaというものがあって、今作ったAmoyテストネット上のNFTも扱えます。やってみましょう。

https://testnets.opensea.io/ja/account

Chromeでアクセスすると、metamaskのアカウントの紐づけによりログインできます。自動的にAmoyテストネットに繋いで、あなたのmetamask上のウォレットに紐づいて生成したり所持しているNFTが全部表示されます（metamask上でNFTを表示するにはわざわざインポート作業が必要でしたが、こちらは勝手に検索してすべて表示してくれるので楽ですね😊）。
値段をつけて売買することも可能です（試してませんが、すぐできそうです）

OpenSeaでのテストネット版NFTの表示等については以下を参考にしました：

https://qiita.com/h2m_kinoko/items/0f044609a9ad446a1d55


## 議論

ここまでできたら、自分たちが何ができたのか、どういうことができるのかを議論しましょう。

議論ポイント例：
* solidityとnode.jsの関係
* ERC-721とは
* NFTの画像はどこに格納されているのか
* metamaskの役割、できること、なぜできるか
* メルカリNFTがユーザにウォレットを作らせないことについて

勉強：
* 今回はNFTの仕様やSolidityの内容には詳しく触れませんが、以下のサイトで簡単にかつ詳しく学べます。

https://wizard.openzeppelin.com/#erc721
