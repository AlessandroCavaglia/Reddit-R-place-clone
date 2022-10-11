# R/Place clone

This Github project is an exercise i decided to start after following a redis codelab at Reply organized by Vittorio Saettone.

## Objectives

Develop a clone of the reddit annual event R/Place, an interactive html page where everyone can place coloured pixels and try to build colorful drawings.

## Project Overview
The backend is developed with Java Spring using Redis for fast data
access, the front-end is developed with vanilla js html and a cool css style i 
found online called cyberpunk css [Github Repo](https://github.com/gwannon/Cyberpunk-2077-theme-css). 
The front-end has been developed two times, i started using spans for cells but had performance issues
and migrated to using canvas, the span version isn't maintened anymore and the canvas is the official one.

## Project Status
Concluded

## Results
The result is a simple website managed with spring that can be easyli dockerized and gives a simple rPlace clone with zoom 
features.A missing feature is a limit for the requests but this is meant as an exercise so it isn't gonna be implemented

## Installation
The project is a simple spring maven project that can be easily run with standard maven. The project is configured to run with a redis local image
i suggest using docker with 
'''
docker pull redis
'''

## Proof of concept

![](https://raw.githubusercontent.com/AlessandroCavaglia/Reddit-R-place-clone/main/RPLACE_2.gif)

## License
[AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/)
