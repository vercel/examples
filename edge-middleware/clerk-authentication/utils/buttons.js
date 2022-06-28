import { useClerk } from '@clerk/nextjs'

export const SignInButton = ({ children, ...props }) => {
  const { openSignIn } = useClerk()
  return (
    <button {...props} onClick={() => openSignIn()}>
      {children}
    </button>
  )
}

export const SignUpButton = ({ children, ...props }) => {
  const { openSignUp } = useClerk()
  return (
    <button {...props} onClick={() => openSignUp()}>
      {children}
    </button>
  )
}

export const SignUpCover = ({ children, id }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-filter backdrop-blur bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <SignUpButton
        id={id}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {children}
      </SignUpButton>
    </div>
  )
}

export const SignInCover = ({ children, id }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <SignInButton
        id={id}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {children}
      </SignInButton>
    </div>
  )
}
