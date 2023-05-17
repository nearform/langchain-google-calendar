import chalk from 'chalk'

const checkEnvVars = () => {
  const requiredEnvVars = [
    'OPEN_AI_API_KEY',
    'CLIENT_EMAIL',
    'PRIVATE_KEY',
    'CALENDAR_ID'
  ]

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.error(
      chalk.bold.red(
        `The following environment variables are missing: ${missingEnvVars.join(
          ', '
        )}. Please check the readme for more information.`
      )
    )
    process.exit(1)
  }
}

export { checkEnvVars }
