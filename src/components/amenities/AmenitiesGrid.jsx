import {amenities} from '../../data/AmenitiesData'
import AmenityCard from './AmenitiesCard'

const AmenitiesGrid = () => {
  return (
    <section className="py-8">
      <div className="w-[90%] mx-auto py-2 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity) => (
            <AmenityCard
              key={amenity.id}
              icon={amenity.icon}
              title={amenity.title}
              description={amenity.description}
              color={amenity.color}
              image={amenity.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AmenitiesGrid
