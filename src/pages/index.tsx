import Head from 'next/head'
import Hero from '@/components/marketing/Hero'
import DestinationGrid from '@/components/marketing/DestinationGrid'
import HowItWorks from '@/components/marketing/HowItWorks'
import SocialProof from '@/components/marketing/SocialProof'
import FinalCTA from '@/components/marketing/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>RHAI | Evalúa tu fortaleza migratoria</title>
        <meta
          name="description"
          content="Evalúa la fortaleza de tu caso migratorio antes de aplicar."
        />
      </Head>

      <main className="page-shell">
        <Hero />
        <DestinationGrid />
        <HowItWorks />
        <SocialProof />
        <FinalCTA />
      </main>
    </>
  )
}