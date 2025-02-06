import { signIn } from "@/auth";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/Navbar";

const slides = [
  "./homeSlide1.png",
  "./homeSlide1.png",
  "./homeSlide1.png",
  "./homeSlide1.png",
  "./homeSlide1.png",
];

import Image from "next/image";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <div className=" home_container relative">
        <Image
          src={"/bio.png"}
          alt="bio"
          width={50}
          height={50}
          className="absolute left-36 bottom-36 border-2 border-black-200 rounded-full p-1"
        />
        <Image
          src={"/growth.png"}
          alt="bio"
          width={50}
          height={50}
          className="absolute left-44 top-40 border-black-200 rounded-full p-1"
        />
        <Image
          src={"/planet-earth.png"}
          alt="bio"
          width={50}
          height={50}
          className="absolute right-36 top-40 border-black-200 rounded-full p-1"
        />
        <Image
          src={"/plant.png"}
          alt="bio"
          width={50}
          height={50}
          className="absolute right-48 bottom-36 border-black-200 rounded-full p-1"
        />
        <h1 className="heading">
          Take control of your impact—track and offset your{" "}
          <span className="bg-primary-100 rounded-[20px] p-2">
            carbon footprint{" "}
          </span>{" "}
          for a sustainable future.
        </h1>
        <div className="button_container rotate-12 max-w-36 absolute right-32 bottom-8">
          <p className="text-30-semibold">
            Every footprint counts—track today, sustain tomorrow!
          </p>
        </div>
      </div>

      <section className="flex justify-center items-center h-screen ">
        <div className="max-w-lg">
          <Carousel autoSlide={true}>
            {[...slides.map((s, i) => <img src={s} key={i} />)]}
          </Carousel>
        </div>
      </section>

      <footer className="absolute bottom-0 bg-secondary w-full p-4 text-center flex flex-row flex-wrap justify-between items-stretch">
        <p className="text-30-semibold text-primary">Green Planet</p>
        <p className="text-30-semibold text-primary">Green Planet</p>
        <p className="text-30-semibold text-primary">Green Planet</p>
        <p className="text-30-semibold text-primary">Green Planet</p>
        <p className="text-30-semibold text-primary">Green Planet</p>
        <p className="text-30-semibold text-primary">Green Planet</p>
      </footer>
    </div>
  );
}
