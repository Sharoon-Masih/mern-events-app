import CategoryFilter from "@/components/shared/categoryFilter";
import Collection from "@/components/shared/collection";
import Search from "@/components/shared/search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.action";
import { SearchParamProps } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {

  const page = Number(searchParams?.page) || 1; //yaha par searchParam ka through we are getting  the page number but  if it is not there then we are setting it to 1, but page number search ma kis tarah hoga set, toh uska liya jo pagination.tsx hai usme humna onClickBtn ma "formNewQuery" ka jo func hai wo call kia hai toh uskay through Url create hoga jisma "page" query paramter hoga
  const searchText = searchParams?.query as string || ""; //yeh pagination sa koi taluk nhi hai, yeh basically wo searchText hai jo user search bar ma search krega. yeh bhi searchParams ma hoga, but if it is not there then we are setting it to empty string.
  const category = searchParams?.category as string || ""; //iska be pagination sa koi taluk nhi, yeh  basically wo category hai jo user category filter ma select krega. yeh bhi searchParams ma hoga, but if it is not there then we are setting it to empty string.
  const events = await getAllEvents( //agay ki sari functionality iss action ma hai.
    {
      query: searchText,
      category: category,
      limit: 6,
      page: page
    })
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
            <Search placeholder="search event" />
            <CategoryFilter/>
          </div>
          <Collection
            data={events?.data}
            emptyTitle="No Event found"
            emptyStateSubText="Right now there is no event come back later"
            collectionType={"All_Events"}
            limit={6}
            page={page}
            totalPage={events?.totalPages} />
        </div>

      </section>
    </>
  );
}
