import {Fragment} from "react";

const Intro = () => {
  return (
    <Fragment>
      <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
          Hi, I'm Soof
        </h1>
        <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
          Welcome to my (maybe updated) blog 👋
        </h4>
      </section>
      <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
        <h1 className="text-1xl md:text-2xl font-bold tracking-tighter leading-tight md:pr-8">
          I write about technology, personal projects, art installations and more
        </h1>
      </section>
    </Fragment>
  )
}

export default Intro
