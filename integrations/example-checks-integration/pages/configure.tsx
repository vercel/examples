import Layout from 'components/layout'
import { useRouter } from 'next/router'

// The URL of this page should be added as Configuration URL in your integration settings on Vercel
export default function Configure() {
  const router = useRouter()

  return (
      <Layout>
          <div className="space-y-2 text-center">
              <h1 className="text-lg font-medium">Checks Integration</h1>
              <p className="max-w-lg">
                  This page is used to show some configuration options for the configuration with the id{' '}
                  <code className="text-sm inline-block" style={{ color: '#F81CE5', minWidth: 245 }}>
                      {router.query.configurationId}
                  </code>
              </p>
          </div>
      </Layout>
  );
}