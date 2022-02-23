import supabase from '@/lib/supabase'
import cuid from 'cuid'

export default async function post(req, res) {
  switch (req.method) {
    case 'GET': {
      const { postId, siteId, published } = req.query

      if (postId) {
        // get individual post
        const {
          data: [post],
        } = await supabase.from('post').select('*').eq('id', postId)

        const { data } = await supabase
          .from('site')
          .select('*')
          .eq('id', post.siteId)

        res.status(200).json({ ...post, site: data[0] })
      } else {
        // get all posts
        const { data: posts } = await supabase
          .from('post')
          .select('*')
          .eq('siteId', siteId)

        const { data: siteData } = await supabase
          .from('site')
          .select('*')
          .eq('id', siteId)

        res.status(200).json({ posts, site: siteData[0] })
      }
      return
    }
    case 'POST': {
      // create post
      const { siteId } = req.query
      const { data } = await supabase.from('post').upsert({
        image: `/placeholder.png`,
        imageBlurhash:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==',
        siteId,
        slug: cuid(),
        content: [
          {
            type: 'paragraph',
            children: [{ text: `Write about your post` }],
          },
        ],
      })

      res.status(200).json({ postId: data[0].id })
      return
    }
    case 'DELETE': {
      // delete post
      const { postId } = req.query
      await supabase.from('post').delete().match({ id: postId })

      res.status(200).end()
      return
    }
    case 'PUT': {
      // publish post, update post content, update post settings
      const {
        id,
        title,
        description,
        content,
        slug,
        image,
        imageBlurhash,
        published,
      } = req.body

      const { data } = await supabase.from('post').upsert({
        title,
        description,
        content,
        slug,
        image,
        imageBlurhash,
        published,
        id,
      })

      res.status(200).json(data[0])
    }
    default:
      res.status(405).end()
      return
  }
}
