# About the project

This project is a solution for the challenge [Build a caching server that caches responses from other servers.](https://roadmap.sh/projects/caching-server) from [roadmap.sh](https://roadmap.sh). The goal was to create a caching server that can store and retrieve responses from other servers to improve performance and reduce latency.

I built the server using BunJS, a node.js alternative. It was my first time using it, and i found it interesting, has lot of utils very easy to use and understand. I was a little surprised by its performance, it is really fast.

## Features
- Caches responses from other servers
- Supports GET requests
- Can start the server on a specified port
- Uses node-cache dependency for caching
- Has a caching method created by me that stores the each response in a JSON file.

## How to use
1. Clone the repository
2. Install BunJS from [here](https://bun.sh/)
3. Run `bun install` to install dependencies
4. Run `bun link` to link the project
5. Start the server with `caching-proxy --port <port_number> --origin <origin_url>`
6. To clear the cache, run `caching-proxy --clear-cache`   