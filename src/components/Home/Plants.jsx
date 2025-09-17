import Card from './Card'
import Container from '../Shared/Container'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import LoadingSpinner from '../Shared/LoadingSpinner'

const Plants = () => {
  const { data: plants, isLoading, error } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/plants`)
      // console.log(data);
      return data
    }
  })

  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  if (error) return <div>Error: {error.message}</div>

  console.log(plants);

  return (
    <Container>
      {
        plants && plants.length ? (<div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {
            plants.map(plant => <Card
              key={plant._id}
              plant={plant}
            />)
          }
        </div>) : <p>There no available Data!</p>
      }
    </Container>
  )
}

export default Plants
