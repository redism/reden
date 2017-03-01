#!/bin/bash
gcc -Wall -g -O3 -ObjC -framework Foundation -framework AppKit -o bin/impbcopy ext/impbcopy.m
rm -rf bin/impbcopy.dSYM
