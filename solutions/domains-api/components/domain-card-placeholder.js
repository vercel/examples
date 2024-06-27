import LoadingDots from '../components/loading-dots'
import ConfiguredSectionPlaceholder from './configured-section-placeholder'

const DomainCardPlaceholder = () => {
  return (
    <div className="w-full mt-10 shadow-md border-y border border-gray-50 rounded-lg">
      <div className="flex justify-between flex-col gap-4 md:flex-row p-6 pb-0">
        <div className="h-7 w-36 bg-gray-300 rounded-md animate-pulse" />
        <div className="flex space-x-3">
          <button
            disabled={true}
            className="cursor-not-allowed bg-gray-100 text-gray-500 border-gray-200 py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150"
          >
            <LoadingDots />
          </button>
          <button
            disabled={true}
            className="bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150"
          ></button>
        </div>
      </div>
      <ConfiguredSectionPlaceholder />
    </div>
  )
}

export default DomainCardPlaceholder
