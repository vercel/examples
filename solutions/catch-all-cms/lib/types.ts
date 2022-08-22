export type PropsType<
  // Matches inferred function types and the GetStaticProps and GetServerSideProps types
  T extends (...args: any[]) => Promise<{}> | {}
> = // Try extracting the type with props from an union type
  Extract<Awaited<ReturnType<T>>, { props: any }> extends { props: infer P }
    ? Awaited<P> extends {} // P can be unknown if the function returns void
      ? Awaited<P> // GetServerSideProps can return a Promise for the props value
      : {}
    : {}
