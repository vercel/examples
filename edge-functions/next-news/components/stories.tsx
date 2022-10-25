import Story from './updating-story'
import Link from 'next/link'

const Stories = ({ stories, page = 1, offset = null }) => (
  <div>
    {stories.map((story, i) => (
      <div key={story.id} className="item">
        {null != offset ? (
          <span className="count">{i + offset + 1}</span>
        ) : null}
        <div className="story">
          <Story {...story} />
        </div>
      </div>
    ))}
    <footer className="footer">
      <Link href={`/news/${page + 1}`} legacyBehavior>
        <a>More</a>
      </Link>
    </footer>

    <style jsx>{`
      .item {
        display: flex;
        margin: 10px 0;
      }

      .count {
        flex-basis: auto;
        flex-grow: 1;
        vertical-align: top;
        font-size: 14px;
        padding-right: 5px;
        display: block;
        width: 20px;
        text-align: right;
      }

      .count::after {
        content: '.';
      }

      .story {
        flex: 100;
        display: inline-block;
      }

      .footer {
        padding: 10px 0 40px 30px;
      }

      .footer a {
        color: #000;
        font-size: 14px;
        display: inline-block;
        text-decoration: none;
      }
    `}</style>
  </div>
)

export default Stories
