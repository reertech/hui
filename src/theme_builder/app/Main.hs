{-# LANGUAGE OverloadedStrings #-}

import Data.Aeson (encode, ToJSON, toJSON, object, (.=))
import qualified Data.ByteString.Lazy as B
import qualified Data.HashMap.Strict as HM
import Data.HashMap.Strict (HashMap)
import qualified Data.Text as T
import System.Environment (getArgs)
import Text.CSS.Parse (parseBlocks)
import Text.CSS.Parse.Types (Block(..), Rule(..))

-- Convert CSS rules to a HashMap
cssToHashMap :: [Block] -> HashMap T.Text (HashMap T.Text T.Text)
cssToHashMap blocks = HM.fromList $ map blockToTuple blocks
  where
    blockToTuple (Block selectors properties) =
        (T.intercalate ", " selectors, HM.fromList $ map propertyToTuple properties)
    propertyToTuple (Rule key value) = (key, value)

-- Define a newtype for HashMap to enable JSON serialization
newtype CSSMap = CSSMap { getCSSMap :: HashMap T.Text (HashMap T.Text T.Text) }

instance ToJSON CSSMap where
    toJSON (CSSMap hm) = toJSON hm

main :: IO ()
main = do
    -- Get file paths from command-line arguments
    args <- getArgs
    -- Read and parse each file
    blocks <- fmap concat $ mapM readAndParseFile args
    let cssMap = cssToHashMap blocks
    -- Convert to JSON and save to file
    let json = encode (CSSMap cssMap)
    B.writeFile "output.json" json
    putStrLn "CSS properties and values saved to output.json"

-- Read a CSS file and parse it
readAndParseFile :: FilePath -> IO [Block]
readAndParseFile filePath = do
    content <- readFile filePath
    let parsed = parseBlocks (T.pack content)
    case parsed of
        Left err -> error $ "Failed to parse CSS file: " ++ show err
        Right blocks -> return blocks
