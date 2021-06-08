#!/bin/bash
#命令：sh ./build/rm-map.sh
#打包后删除dist文件夹下的 .map文件 
rm -f ./dist/css/*.map
rm -f ./dist/js/*.map