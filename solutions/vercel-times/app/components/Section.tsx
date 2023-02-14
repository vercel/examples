interface Article {
  title: string
  description: string
  updates?: boolean
  live?: boolean
}
interface IncomingData {
  header: {
    headline: string
    topics: Array<string>
  }
  articles: Array<Article>
}

function OneArticleSection({ data }: { data: IncomingData }) {
  return (
    <section className="border-t border-neutral-900 z-20 w-full mt-5">
      <div className="grid grid-cols-3 gap-3 pt-4">
        <div className="cols-span-1">
          <article className="">
            <h3 className="text-md font-semibold font-serif pb-1.5 pr-4">
              Covid Protests in China Raise Hope for Solidarity Among Activists
              Abroad
            </h3>
            <p className="text-sm font-serif pb-2 text-neutral-800">
              People opposing Beijing over issues like Hong Kong, Taiwan or the
              persecution of Uyghurs see the moment as an opportunity to find
              common cause.
            </p>
            <div className="flex flex-row items-center">
              <span className="flex text-xs space-x-4 mr-1 uppercase">
                5 Min Read
              </span>
            </div>
          </article>
        </div>
        <div className="col-span-2">
          <article className="px-6 pb-6">
            <div className="h-[347px] flex bg-red-200 mb-2"></div>
            <div className="text-neutral-600 text-xs text-right italic">
              Epigrafe
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function MultiArcticleSection({ data }: { data: IncomingData }) {
  return (
    <section className="border-t border-black py-4">
      {data.header && (
        <nav className="flex flex-row items-center space-x-6 py-4">
          <div className=" font-semibold flex text-sm">
            {data.header.headline}
          </div>
          <ul className="flex flex-row flex-1 whitespace-nowrap text-xs space-x-4 font-medium">
            {data.header.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </nav>
      )}
      <div className="grid grid-cols-3 gap-3 divide-neutral-200 divide-x">
        <div className="cols-span-1 divide-neutral-200 divide-y space-y-4">
          {data.articles.slice(1).map((article: Article) => (
            <article className="pt-2" key={article.title}>
              {article.live && (
                <span className="text-red-600 uppercase text-xs font-bold mb-1 inline-block">
                  LIVE
                </span>
              )}
              <h3 className="text-md font-semibold font-serif pb-1.5 pr-4">
                {article.title}
              </h3>
              <p className="text-sm font-serif pb-2 text-neutral-800">
                {article.description}
              </p>
              {article.updates && (
                <div className="flex flex-row items-center">
                  <span className="flex text-xs space-x-4 mr-1">
                    See more updates
                  </span>
                  <span className="flex-inline bg-slate-800 px-1.5 text-white rounded-full text-xs">
                    9+
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="col-span-2">
          <article className="px-6 pb-6">
            <div className="h-[347px] flex bg-red-200 mb-2"></div>
            <h3 className="text-md font-semibold font-serif py-1.5 pr-4">
              {data.articles[0].title}
            </h3>
            <p className="text-sm font-serif pb-2 text-neutral-800">
              {data.articles[0].description}
            </p>
            {data.articles[0].updates && (
              <div className="flex flex-row items-center">
                <span className="flex text-xs space-x-4 mr-1">
                  See more updates
                </span>
                <span className="flex-inline bg-slate-800 px-1.5 text-white rounded-full text-xs">
                  7+
                </span>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}

export const Section = ({ data }: { data: IncomingData }) => {
  if (data.articles.length > 1) {
    return <MultiArcticleSection data={data} />
  }
  return <OneArticleSection data={data} />
}
