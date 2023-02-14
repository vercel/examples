import type { FC } from 'react'
import type { Story as TStory } from '../../nytimes-api'
import { StoryWrapper } from './story-wrapper'
import { StoryBody } from './story-body'
import { StoryPhoto } from './story-photo'

export const Story: FC<{ story: TStory }> = ({ story }) => (
  <StoryWrapper>
    <div className="col-span-5">
      <StoryBody story={story} readTime />
    </div>
    <div className="col-span-9">
      <StoryPhoto story={story} caption />
    </div>
  </StoryWrapper>
)
