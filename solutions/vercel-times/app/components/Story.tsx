import type { FC } from 'react'
import type { Story } from '../nytimes-api'
import StoryWrapper from './StoryWrapper'
import StoryBody from './StoryBody'
import StoryPhoto from './StoryPhoto'

const Story: FC<{ story: Story }> = ({ story }) => (
  <StoryWrapper>
    <div className="col-span-5">
      <StoryBody story={story} readTime />
    </div>
    <div className="col-span-9">
      <StoryPhoto story={story} caption />
    </div>
  </StoryWrapper>
)

export default Story
