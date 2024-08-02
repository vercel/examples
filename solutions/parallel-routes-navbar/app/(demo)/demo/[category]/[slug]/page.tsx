const DATA = {
  'key-lime-pie': `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porttitor
  accumsan vestibulum. Mauris dictum hendrerit ex. Ut lacus libero, feugiat
  sed turpis non, vehicula eleifend ex. Nulla in augue interdum, suscipit
  diam eu, aliquam magna. Etiam convallis lacus mattis nulla aliquam, quis
  tempor ante accumsan. Aenean non libero tempus mi eleifend pulvinar id ac
  nulla. Nullam at nisi sed augue mattis varius ac quis purus. Vivamus
  mollis arcu placerat venenatis commodo. Donec et dui iaculis, tristique
  diam vel, commodo erat. In vel orci quis orci feugiat laoreet.`,
  'pumpkin-pie': `Donec et dui iaculis, tristique diam vel, commodo erat.
  In vel orci quis orci feugiat laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Morbi porttitor accumsan vestibulum. Mauris dictum hendrerit ex.
  Ut lacus libero, feugiat sed turpis non, vehicula eleifend ex. Nulla in augue interdum, suscipit
  diam eu, aliquam magna. Etiam convallis lacus mattis nulla aliquam, quis
  tempor ante accumsan. Aenean non libero tempus mi eleifend pulvinar id ac
  nulla. Nullam at nisi sed augue mattis varius ac quis purus. Vivamus
  mollis arcu placerat venenatis commodo.`,
  'apple-pie': `Nulla in augue interdum, suscipit
  diam eu, aliquam magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porttitor
  accumsan vestibulum. Mauris dictum hendrerit ex. Ut lacus libero, feugiat
  sed turpis non, vehicula eleifend ex. Etiam convallis lacus mattis nulla aliquam, quis
  tempor ante accumsan. Aenean non libero tempus mi eleifend pulvinar id ac
  nulla. Nullam at nisi sed augue mattis varius ac quis purus. Vivamus
  mollis arcu placerat venenatis commodo. Donec et dui iaculis, tristique
  diam vel, commodo erat. In vel orci quis orci feugiat laoreet.`,
}

export default function SlugPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  return (
    <main>
      {DATA[slug as keyof typeof DATA] ||
        `Integer et lacus orci.
      Integer non libero vestibulum, convallis erat ac, euismod mauris. Etiam
      auctor nulla sed neque egestas condimentum. Duis sed metus malesuada,
      cursus massa vitae, feugiat est.`}
    </main>
  )
}
