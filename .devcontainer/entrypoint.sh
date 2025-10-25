#!/bin/bash
set -e

# 非rootユーザーでコマンド実行
exec gosu "${USER_NAME}" "$@"
