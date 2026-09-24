import Image from 'next/image'
import { MessageCircle, Repeat2, Heart, BarChart2 } from 'lucide-react'
import { AnimateOnView } from '~/components/core/animate-on-view'

interface Tweet {
  displayName: string
  handle: string
  avatar: string
  body: string
  replies: number
  retweets: number
  likes: number
  views: string
  timestamp: string
}

const TWEETS: Tweet[] = [
  {
    displayName: 'Sarah',
    handle: '@sarahfin',
    avatar: '/images/testimonials/sarah.jpg',
    body: 'the fact that some of you are giving OpenClaw your passwords and API keys in a plaintext file in 2026 is actually crazy to me',
    replies: 14,
    retweets: 87,
    likes: 342,
    views: '12.4K',
    timestamp: '3:42 PM · Feb 8, 2026',
  },
  {
    displayName: 'Palash Kala',
    handle: '@kalapolish',
    avatar: '/images/testimonials/palash.jpg',
    body: 'A friend asked me to help him set up OpenClaw over the weekend. 2 hours of Docker, port forwarding, .env files. I said bro just try TrustClaw. He messages me from Telegram 5 minutes later like "wait that\'s it?" Yes. That\'s it :)',
    replies: 7,
    retweets: 28,
    likes: 189,
    views: '3.2K',
    timestamp: '9:15 AM · Feb 10, 2026',
  },
  {
    displayName: 'Soham',
    handle: '@GanatraSoham',
    avatar: '/images/testimonials/soham.jpg',
    body: '1800 exposed OpenClaw instances leaking API keys this week and people are still handing it their credentials in plaintext. absolute state of AI security in 2026',
    replies: 34,
    retweets: 93,
    likes: 412,
    views: '11.3K',
    timestamp: '11:30 AM · Feb 11, 2026',
  },
  {
    displayName: 'Karan Vaidya',
    handle: '@KaranVaidya6',
    avatar: '/images/testimonials/karan.jpg',
    body: "TrustClaw >>> OpenClaw for anyone who doesn't want to mass expose their credentials. OAuth only, sandboxed execution, works straight from Telegram. Genuinely don't know why anyone is still self-hosting an AI agent with root access in 2026",
    replies: 31,
    retweets: 156,
    likes: 847,
    views: '38.2K',
    timestamp: '2:08 PM · Feb 12, 2026',
  },
]

function TweetCard({ tweet, index }: { tweet: Tweet; index: number }) {
  return (
    <AnimateOnView
      className="border-border bg-card rounded-xl border p-4"
      delay={index * 0.1}
      margin="-60px"
    >
      {/* Header row */}
      <div className="flex items-center gap-2.5">
        <Image
          src={tweet.avatar}
          alt={tweet.displayName}
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div className="text-foreground text-sm font-bold">
            {tweet.displayName}
          </div>
          <div className="text-muted-foreground text-sm">{tweet.handle}</div>
        </div>
      </div>

      {/* Body */}
      <p className="text-foreground mt-3 text-sm leading-relaxed">
        {tweet.body}
      </p>

      {/* Engagement row */}
      <div className="text-muted-foreground/60 mt-3 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          {tweet.replies}
        </span>
        <span className="flex items-center gap-1">
          <Repeat2 className="h-3.5 w-3.5" />
          {tweet.retweets}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {tweet.likes}
        </span>
        <span className="flex items-center gap-1">
          <BarChart2 className="h-3.5 w-3.5" />
          {tweet.views}
        </span>
      </div>

      {/* Timestamp */}
      <div className="text-muted-foreground mt-2 text-xs">
        {tweet.timestamp}
      </div>
    </AnimateOnView>
  )
}

export function TestimonialsSection() {
  return (
    <section className="border-border relative overflow-hidden border-t px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-16">
          <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            No seriously, stop giving OpenClaw your passwords.
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TWEETS.map((tweet, index) => (
            <TweetCard key={tweet.handle} tweet={tweet} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
