import type { FC, ReactNode } from 'react'

const StoryWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <section className="border-t border-neutral-900 z-20 w-full pb-6">
    <div className="grid grid-cols-14 gap-x-[calc(1rem_*_2_+_1px)] pt-4">
      {children}
    </div>
  </section>
)

export default StoryWrapper
