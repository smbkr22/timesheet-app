export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Track Your Work Hours
        </h2>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Say goodbye to tedious spreadsheets and complicated timekeeping
          methods. With Time Sheet, you can effortlessly log your work hours
          with just a few clicks. Our intuitive interface makes it easier than
          ever to keep a precise record of your daily, weekly, and monthly work
          hours.
        </p>
      </div>
      {/* <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div> */}
    </section>
  );
}
