import Head from 'next/head'
import styled from 'styled-components'
import { useState } from 'react'

import Map from '../components/Map'
import { SearchGroup } from '../components/Search/SearchGroup'

import { Navbar } from '../components/Navbar/Navbar'

const StyledMain = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

export default function Home() {

  const filterToggles = [
    { key: "arts", label: "Arts" },
    { key: "tourism", label: "Tourism" },
    { key: "language", label: "Language" },
  ]

  const [activeFilter, setActiveFilter] = useState(false)
  const [searchFilters, setSearchFilters] = useState(
    {
      arts: false,
      tourism: false,
      language: false,
    }
  )

  function handleActivateFilter() {
    setActiveFilter(!activeFilter)
  }

  function handleSelectFilter(filter) {
    setSearchFilters({ ...searchFilters, [filter]: !searchFilters[filter] })
  }

  const navPages = ["Home", "Explore", "Contribute", "Profile"]

  const [activePage, setActivePage] = useState("Home")

  function handleSelectPage(pageName) {
    if (pageName === activePage) {
      return
    }

    if (!navPages.includes(pageName)) {
      return
    }

    window.location.href = `/${pageName.toLowerCase()}`
  }

  return (
    <div>
      <Head>
        <title>First Maps</title>
        <meta name="description" content="First Maps" />
        <link rel="icon" href="/location-dot-solid.svg" />
      </Head>

      <StyledMain>

        <SearchGroup
          activeFilter={activeFilter} 
          filterToggles={filterToggles} 
          handleActivateFilter={handleActivateFilter} 
          searchFilters={searchFilters}
          handleSelectFilter={handleSelectFilter} 
        />

        <Map 
          fullSize={true}
          allowAddingMarkers={false}
        />

        <Navbar 
          handleSelectPage={handleSelectPage} 
          navPages={navPages} 
          activePage={activePage} 
        />
      </StyledMain>
    </div>
  )
}
