#!/bin/bash
cd /home/ms/codenames/code_pyth/codenames

if [[ $1 == "start" ]] || [[ $1 == "" ]] ; then 

if pgrep -x "code_flask.sh" > /dev/null
then
    echo OK
else
    screen -dmS codef ./code_flask.sh
fi

if pgrep -x "code_web.sh" > /dev/null
then
    echo OK
else
    screen -dmS codew ./code_web.sh
fi

else 
    echo killing codenames
    kill `pgrep code_flask.sh`
    kill `pgrep code_web.sh`
fi
