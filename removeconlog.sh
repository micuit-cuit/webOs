#!/bin/bash
#bash
#read background.js fill and remove the console.log line
#write the new file to background2.js
background=$(cat background.js)
background2=$(echo "$background" | sed '/console\.log/d')
echo "$background2" 
echo "$background2" > background.js