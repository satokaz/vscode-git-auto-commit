# vscode-git-auto-commit README

git status からファイルの情報を切り出して commit message を作成し、`git commit -m` または `git commit -am` を自動で行う vscode 拡張機能。
汎用的ではない。

## 設定項目

ユーザー設定(setings.json) に書かれている場合は、エラーとする。
ワークスペース(フォルダ)の `.vscode/settings.json` すなわち、ワークスペース設定にのみ記載が可能

* `git-autoCommit.enable`: 機能を有効にするか？
* `git-autoCommit.autostage`: Untrack ものを自動 staging するか？
* `git-autoCommit.interval` : commit 間隔

## 参考

* [[Git] 簡単なコミットメッセージを自動生成](http://nobuyo.github.io/article/git-auto-commit-message/)
* [2.2 Git の基本 - 変更内容のリポジトリへの記録](https://git-scm.com/book/ja/v1/Git-の基本-変更内容のリポジトリへの記録)

