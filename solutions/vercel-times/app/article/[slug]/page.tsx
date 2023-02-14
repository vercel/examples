import Link from 'next/link'
import { CookieBanner } from 'app/components/cookie-banner'
import { Ad } from 'app/components/ad'
import { Logo } from 'app/components/logo'
import { TLogo } from 'app/components/TLogo'
import { getNYTimesTopStories, getStoryRouteSegments } from 'app/nytimes-api'

export async function generateStaticParams() {
  const stories = await getNYTimesTopStories()
  const routes = []

  for (const story of stories.results) {
    const { type, params } = getStoryRouteSegments(story.url)
    if (type === 'article') {
      routes.push(params)
    }
  }

  return routes
}

export default function Page() {
  return (
    <div>
      <CookieBanner />
      <Ad />
      <div>
        <header className="border-b border-[#e2e2e2]">
          <section className="max-w-[1605px] h-[42px] flex justify-around items-center relative my-0 mx-auto pt-1 pb-0.5 px-4">
            <div className="flex absolute left-2.5">
              <ul className="flex flex-0 flex-row space-x-4 items-center">
                <li className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-neutral-200 pointer">
                  <svg viewBox="0 0 16 16" width={16} height={16}>
                    <rect x="1" y="3" fill="#333" width="14" height="2"></rect>
                    <rect x="1" y="7" fill="#333" width="14" height="2"></rect>
                    <rect x="1" y="11" fill="#333" width="14" height="2"></rect>
                  </svg>
                </li>
                <li className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-neutral-200 pointer">
                  <svg viewBox="0 0 16 16" width={16} height={16}>
                    <path
                      fill="#333"
                      d="M11.3,9.2C11.7,8.4,12,7.5,12,6.5C12,3.5,9.5,1,6.5,1S1,3.5,1,6.5S3.5,12,6.5,12c1,0,1.9-0.3,2.7-0.7l3.3,3.3c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L11.3,9.2zM6.5,10.3c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C10.3,8.6,8.6,10.3,6.5,10.3z"
                    ></path>
                  </svg>
                </li>
              </ul>
            </div>
            <div>
              <Link href="/" className="block text-center">
                <Logo height={26} width={195} />
              </Link>
            </div>
          </section>
        </header>
      </div>
      <article>
        <div>
          <div className="flex justify-center relative border-b border-stroke-quaternary">
            <span className="flex absolute left-0 h-[55px] items-center px-2.5">
              <span className="p-2.5">
                <Link href="/">
                  <TLogo />
                </Link>
              </span>
            </span>
            <nav className="flex min-w-[620px] pl-5 overflow-x-auto">
              <h3 className="text-[0.9375rem] leading-[0.9375rem] font-bold flex items-center">
                <span className="mr-4 pr-4 border-r border-stroke-quaternary">
                  The Death of Tyre Nichols
                </span>
              </h3>
              <ul className="flex text-sm font-medium">
                {[
                  '6th Officer Suspended',
                  'Video Details Fatal Beating',
                  'Timeline',
                  'Who Was Tyre Nichols?',
                  '71 Commands in 13 Minutes',
                ].map((item) => (
                  <li key={item} className="py-[1em] mr-[1.4em]">
                    <Link href="/">{item}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-10">
          <header className="w-[600px] mx-auto mt-[3.75rem] mb-5">
            <h1 className="font-bold text-4xl font-serif italic leading-[2.875rem] mb-2">
              Initial Police Report on Tyre Nichols Arrest Is Contradicted by
              Videos
            </h1>
            <p className="text-[1.3rem] leading-[1.875rem] font-serif font-light text-[#363636] mb-[1.875rem]">
              The police report was the latest instance in which video evidence
              offered a starkly different account of police violence than what
              officers had reported themselves.
            </p>
            <div
              role="toolbar"
              aria-label="Social Media Share buttons, Save button, and Comments Panel with current comment count"
              className="border-t border-[#ebebeb] pt-5"
            >
              <ul className="flex">
                <li className="mr-3">
                  <button
                    type="button"
                    className="rounded-[30px] border border-[#dfdfdf] text-xs font-medium flex items-center py-1.5 px-2.5"
                  >
                    <svg
                      className="mr-[5px]"
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                    >
                      <path
                        d="M18.04 5.293h-2.725c.286-.34.493-.74.606-1.17a2.875 2.875 0 0 0-.333-2.322A2.906 2.906 0 0 0 13.64.48a3.31 3.31 0 0 0-2.372.464 3.775 3.775 0 0 0-1.534 2.483l-.141.797-.142-.847A3.745 3.745 0 0 0 7.927.923 3.31 3.31 0 0 0 5.555.459 2.907 2.907 0 0 0 3.607 1.78a2.877 2.877 0 0 0-.333 2.321c.117.429.324.828.606 1.171H1.155a.767.767 0 0 0-.757.757v3.674a.767.767 0 0 0 .757.757h.424v7.53A1.01 1.01 0 0 0 2.588 19h14.13a1.01 1.01 0 0 0 1.01-.959v-7.56h.424a.758.758 0 0 0 .757-.757V6.05a.759.759 0 0 0-.868-.757Zm-7.196-1.625a2.665 2.665 0 0 1 1.01-1.736 2.24 2.24 0 0 1 1.574-.313 1.817 1.817 0 0 1 1.211.818 1.857 1.857 0 0 1 .202 1.453 2.2 2.2 0 0 1-.838 1.191h-3.431l.272-1.413ZM4.576 2.386a1.837 1.837 0 0 1 1.221-.817 2.23 2.23 0 0 1 1.565.313 2.624 2.624 0 0 1 1.01 1.736l.242 1.453H5.182a2.2 2.2 0 0 1-.838-1.19 1.857 1.857 0 0 1 .202-1.495h.03ZM1.548 6.424h7.54V9.39h-7.58l.04-2.967Zm1.181 4.128h6.359v7.287H2.729v-7.287Zm13.777 7.287h-6.348v-7.307h6.348v7.307Zm1.181-8.468h-7.53V6.404h7.53V9.37Z"
                        fill="#121212"
                        fillRule="nonzero"
                      ></path>
                    </svg>
                    <span>Give this article</span>
                  </button>
                </li>
                <li className="mr-3">
                  <button
                    type="button"
                    className="rounded-[30px] border border-[#dfdfdf] p-1.5"
                  >
                    <svg width="20" height="19" viewBox="0 0 23 18">
                      <path
                        d="M1.357 17.192a.663.663 0 0 1-.642-.81c1.82-7.955 6.197-12.068 12.331-11.68V1.127a.779.779 0 0 1 .42-.653.726.726 0 0 1 .78.106l8.195 6.986a.81.81 0 0 1 .253.557.82.82 0 0 1-.263.547l-8.196 6.955a.83.83 0 0 1-.779.105.747.747 0 0 1-.42-.663V11.29c-8.418-.905-10.974 5.177-11.08 5.45a.662.662 0 0 1-.6.453Zm10.048-7.26a16.37 16.37 0 0 1 2.314.158.81.81 0 0 1 .642.726v3.02l6.702-5.682-6.702-5.692v2.883a.767.767 0 0 1-.242.536.747.747 0 0 1-.547.18c-4.808-.537-8.364 1.85-10.448 6.922a11.679 11.679 0 0 1 8.28-3.093v.042Z"
                        fill="#000"
                        fillRule="nonzero"
                      ></path>
                    </svg>
                  </button>
                </li>
                <li className="mr-3">
                  <button
                    type="button"
                    className="rounded-[30px] border border-[#dfdfdf] p-[8px]"
                  >
                    <svg width="15" height="15" viewBox="0 0 12 18">
                      <g fillRule="nonzero" stroke="#666" fill="none">
                        <path
                          fill="none"
                          d="M1.157 1.268v14.288l4.96-3.813 4.753 3.843V1.268z"
                        ></path>
                        <path
                          d="m12 18-5.9-4.756L0 17.98V1.014C0 .745.095.487.265.297.435.107.664 0 .904 0h10.192c.24 0 .47.107.64.297.169.19.264.448.264.717V18ZM1.157 1.268v14.288l4.96-3.813 4.753 3.843V1.268H1.158Z"
                          fill="#121212"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="rounded-[30px] border border-[#dfdfdf] text-xs font-medium flex items-center pt-[7px] pb-1.5 px-2.5"
                  >
                    <svg
                      className="mr-[5px]"
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                    >
                      <path
                        d="m14.52 17.831-5.715-4.545H2.4a1.468 1.468 0 0 1-1.468-1.469V1.894A1.471 1.471 0 0 1 2.4.405h16.583a1.469 1.469 0 0 1 1.469 1.469v9.923a1.469 1.469 0 0 1-1.47 1.47H14.58l-.06 4.564ZM2.4 1.645a.228.228 0 0 0-.228.229v9.923a.228.228 0 0 0 .228.229h6.811l4.06 3.235v-3.235h5.652a.228.228 0 0 0 .229-.229V1.874a.228.228 0 0 0-.229-.229H2.4Z"
                        fill="#121212"
                        fillRule="nonzero"
                      ></path>
                    </svg>
                    <span>98</span>
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <section className="w-[600px] mx-auto font-serif text-xl">
            <p className="mb-[0.9375rem]">
              MEMPHIS — The videos show a brutal beating in which a group of
              Memphis police officers repeatedly kicked and punched Tyre Nichols
              after they yanked him from his car, shouted a series of threats
              and orders, and then pushed him to the ground while he pleaded for
              them to stop.
            </p>
            <p className="mb-[0.9375rem]">
              But in an official account written up by a police officer only
              hours after the beating, Mr. Nichols, 29, is described as an irate
              suspect who refused to comply with police officers’ directions and
              “started to fight” with them, even reaching for one of their guns.
            </p>
            <p className="mb-[0.9375rem]">
              The videos that were released on Friday do not show Mr. Nichols
              fighting with officers, let alone reaching for any of their guns.
            </p>
            <p className="mb-[0.9375rem]">
              Instead, they show Mr. Nichols, a FedEx employee and father,
              pleading with the police to stop in the moments before they deploy
              pepper spray in his face. At that point, Mr. Nichols gets up and
              runs away as an officer fires a Taser at him. When officers catch
              up with him, less than 100 yards from his mother’s house, they
              tackle and severely beat him, delivering powerful punches, a
              series of kicks and several swings of a baton. At no point does he
              appear to strike back.
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
