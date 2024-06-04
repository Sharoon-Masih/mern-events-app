import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern py-5 md:py-10 bg-center bg-cover">
        <div className="wrapper grid grid-cols-1 md:grid-cols-2 gap-5 2xl:gap-0"> {/*grid isi liya yaha use ki hai kiu kay srff two element hain hero section may and we have to divide them equally iss lia grid krdia bcuz grid by default equal divide krti hai A/c to jitnay column hotay hain unka A/c set krti hai. */}
          <div className="flex flex-col justify-center items-start sm:items-center md:items-start gap-8 justify-items-center sm:text-center md:text-start">
            <h1 className="h1-bold">Host, Connect Celebrate: Your Events, Our platform!</h1>
            <p className="p-regular-20 sm:p-regular-24">Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community.</p>
            <Button className="bg-primary-500 w-full md:w-fit " size={"lg"}><Link href={"#events"}>Explore Now</Link></Button>
          </div>

          <Image
            src={"/assets/images/hero.png"}
            width={1000}
            height={1000}
            alt="hero"
            className="max-h-[70vh] object-contain 2xl:max-h-[60vh]"
          />

        </div>

      </section>
      <section id="events" className="my-8 md:my-12">
        <div className="wrapper flex flex-col gap-8 md:gap-12  ">
          <h2 className="h2-bold">Trust by <br /> Thousands of Events </h2>
          <div className="wrapper flex w-full flex-col gap-5 md:flex-row ">
            search
            category
          </div>
        </div>

      </section>
    </>
  );
}
