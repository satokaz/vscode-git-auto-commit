#!/bin/bash

#
# committer - get git status for commit message
# https://github.com/nobuyo/dotfiles/blob/master/bin/committer
#

function info() {
  echo "committer - generate commit message"
  echo
  echo "[Usage]"
  echo "  % git commit -m \"\$(comitter)\""
}

function check_pwd_is_git_dir {
  if [ ! -e .git ]; then
    echo -e "\033[31mfatal:\033[m Not a git repository, exitting"
    info
    exit 1
  fi
}

function check_changes_to_be_committed {
  git status | grep "Changes to be committed" > /dev/null
  echo "$?"
}

function check_changes_not_staged {
  git status | grep "Changes not staged for commit" > /dev/null
  echo "$?"
}

function restate {
  msg="$(echo $1 | sed -e 's/modified:/update/g' -e 's/deleted:/delete/g')"
}

function summarize {
  if [[ "$(echo "$1" | grep -c '')" -gt 1 ]]; then
    local tmp="$(echo "$1" | head -1 | sed -e 's/:   /: /g')"
    restate "$tmp"
    echo "${msg}, etc."
  else
    restate "$(echo "$1" | sed -e 's/:   /: /g')"
    echo "$msg"
  fi
}

function parse_status {
  if [[ "$(check_changes_to_be_committed)" == "0" ]]; then
    msg="$(git status | sed -n -e '/Changes/,/Changes not staged/p' | sed -n -e '/Changes/,/Untrack/p' | grep $'\t' | sed -e 's/^\t//g')"
    summarize "$msg"
  elif [[ "$(check_changes_not_staged)" == "0" ]]; then
    msg="$(git status | sed -n -e '/Changes not staged/,/Untrack/p' | grep $'\t' | sed -e 's/^\t//g')"
    summarize "$msg"
  fi
}

check_pwd_is_git_dir
parse_status
