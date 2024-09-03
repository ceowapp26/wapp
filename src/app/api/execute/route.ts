// pages/api/execute.js
import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

const runDocker = (mainFile) => {
  return new Promise((resolve, reject) => {
    exec(`docker run --rm -v ${path.join(process.cwd(), 'generated-code')}:/app node:14 node /app/${mainFile}`, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

const runTests = (testFiles) => {
  return Promise.all(testFiles.map(testFile => {
    return new Promise((resolve, reject) => {
      exec(`docker run --rm -v ${path.join(process.cwd(), 'generated-code')}:/app node:14 node /app/${testFile}`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          resolve({ file: testFile, stdout, stderr })
        }
      })
    })
  }))
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { mainFile, testFiles } = req.body

    try {
      const mainExecution = await runDocker(mainFile)
      const testResults = await runTests(testFiles)

      res.status(200).json({
        mainOutput: mainExecution.stdout,
        mainError: mainExecution.stderr,
        testResults
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}