'use client'

import {
  Tabs as ChakraTabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Box,
  Button,
} from '@chakra-ui/react'

export const Buttons: React.FC = () => {
  return (
    <Stack direction="row" spacing={4} align="center">
      <Button colorScheme="brand" variant="outline">
        Button
      </Button>
      <Button colorScheme="brand" variant="ghost">
        Button
      </Button>
      <Button colorScheme="brand" variant="link">
        Button
      </Button>
    </Stack>
  )
}

export const Tabs: React.FC = () => {
  return (
    <ChakraTabs colorScheme="brand">
      <TabList>
        <Tab>One</Tab>
        <Tab>Two</Tab>
        <Tab>Three</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </ChakraTabs>
  )
}

export const Skeletons: React.FC = () => {
  return (
    <>
      <Stack>
        <Skeleton startColor="brand.100" endColor="brand.500" height="20px" />
        <Skeleton startColor="brand.100" endColor="brand.500" height="20px" />
        <Skeleton startColor="brand.100" endColor="brand.500" height="20px" />
      </Stack>
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonCircle startColor="brand.100" endColor="brand.500" size="10" />
        <SkeletonText
          startColor="brand.100"
          endColor="brand.500"
          mt="4"
          noOfLines={4}
          spacing="4"
          skeletonHeight="2"
        />
      </Box>
    </>
  )
}
