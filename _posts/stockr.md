---
title: 'realtime trading monitor - powered by websockets' 
excerpt: 'stockr - a webapp that monitors live trades and quotes' 
coverImage: '/assets/blog/stockr/cover.jpeg' 
date: '2022-03-09T19:11:25.315Z' 
author:
    name: Soof Golan 
    picture: '/assets/blog/authors/sg.jfif' 
ogImage:
    url: '/assets/blog/stockr/cover.jpeg'
---

**This post is not any kind of financial advice in any form**

## TL;DR

I built [stockr][stockr], you can use it to monitor real-time data from the stock market.

Here is the [source code](https://github.com/soof-golan/stockr).

![stockr demo](/assets/blog/stockr/demo.gif)


## Introduction - It's very expensive (in time) to be cheap (in money)

I'm invested in the stock market. Before I purchase stocks (or anything else), 
I want to know what is its price right now. Most of the stock price data you can
find on the internet is delayed by 15 minutes, that is not acceptable for my
posh trading algorithms (psst, I don't have any).

My Options were (sorted by price, descending):

1 - using the market price snapshot data that my broker offers - $0.01

2 - Building a real-time web application from scratch for a live-stream of data I have no actual use of - costs $0.00 - that's ∞ times better! 😉

Faced with these options, I have decided to go with the fun, and oh so inefficient, route.

## Proof of Concept

I've heard that Alpaca (the company, not the animal) provides free access to 
real-time market data. I signed up to their service, and after all the legal stuff
I got my shiny API Key.

A few lines later in the console of my browser, price quotes started streaming
down the `console.log` river.

## Creating stockr

### The Name

It's a stock stalker - if that was unclear, there you have it.
As much as I try to resist, I do a lot of POP (pun oriented programming) 😅

### Architecture

stockr is served statically with cloudflare pages. The client connects to alpaca
using only one WebSocket, exchanges the API Key, and lets the users start typing Tickers

![stock architecture](/assets/blog/stockr/arch.png)

### Frontend

I chose Vite + React to improve my frontend development skills and because 
I like integrating anything resembling the ⚡ emoji. I have little 
practical experience with frontend frameworks, and I must note the on-boarding experience
of React is really awesome. On top of React I used Material UI to achieve a look 
that might mislead you to think I know how to design stuff.

While developing, the HMR (Hot Module Reload) feature of Vite made it super easy to 
update code on the fly. The only downside of HMR is leaking WebSocket into the void
of the JS heap whenever I touched the `SocketController` module.

### Financial Backend

Alpaca provide their market data API over REST and WebSockets, where REST is the
sane thing, and WebSockets are the ridiculously over-powered and inconvenient thing.

I chose to connect using WebSockets, for the extra thrill of 
polling socket states, verifying I have no more than one connection at a time,
and to get familiar with a technology that I think is pretty awesome in its core.

`<Complaint>`

The most painful thing with Alpaca's WebSocket API, is the authentication mechanism.
The client need to very stateful about the authentication handshake, not exactly what
I thought I'd be meddling with when doing this application.

The authentication protocol is implemented over the websocket channel itself. 
After the `wss` connection is established successfully, you must wait for a message
that states the obvious `{"T":"success","msg":"connected"}`. 

Only after that, you may proceed with authentication, send your payload
`{"action":"auth","key": "API_KEY_ID","secret":"API_KEY_SECRET"}` and wait for the
response. Once authenticated, you can subscribe to specific and get callbacks for every update.

I believe a saner way to authenticate would be something like passing the authentication using
[URL parameters](https://stackoverflow.com/questions/499591/are-https-urls-encrypted):

``const ws = new WebSocket(`wss://${baseUrl}?keyId=${keyId}&apiKey=${apiKey}`)``.

To handle errors, the server would drop the connection altogether before 
any messages went on the `wss` channel. This also promotes a more stateless 
approach to the whole auth process, and frees client code to be all about the market data API.

`</Complaint>`

### My Backend

There isn't one, unless you count the static serving of the client. 
By the way, I really liked [Cloudflare Pages](https://pages.cloudflare.com/). maybe I'll write about that product at some point.  

## Conclusion

stockr is a solution in search of problem, but I had a great time building it. 
Now, you can enjoy the fruits of my labor too, just hop over to Alpaca to issue your API key 
and paste it into the [stockr][stockr].

Happy trading!

[stockr]: https://stockr.soofgolan.com/ "stockr"