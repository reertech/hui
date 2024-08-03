{-# LANGUAGE OverloadedStrings #-}

import qualified Data.ByteString as B
import Data.Css (parseBlocks, Block(..), Rule(..), Declaration(..), Value(..))
import qualified Data.HashMap.Strict as HM
import System.Environment (getArgs)
import Control.Monad (forM_)

type CssMap = HM.HashMap String (HM.HashMap String String)

-- Parse a CSS file and return a CssMap
parseCssFile :: FilePath -> IO CssMap
parseCssFile path = do
    content <- B.readFile path
    let blocks = parseBlocks content
    return $ foldr parseBlock HM.empty blocks

-- Parse a single CSS block and add it to the CssMap
parseBlock :: Block -> CssMap -> CssMap
parseBlock (QualifiedBlock (QualifiedSelector sel _) rules) cssMap =
    foldr (parseRule sel) cssMap rules
parseBlock _ cssMap = cssMap

-- Parse a single CSS rule and add it to the CssMap
parseRule :: String -> Rule -> CssMap -> CssMap
parseRule sel (Rule (Declaration prop (Value vals))) cssMap =
    let value = concatMap show vals
        updateSelector = HM.insert prop value
    in HM.insertWith HM.union sel (updateSelector HM.empty) cssMap

-- Main function
main :: IO ()
main = do
    args <- getArgs
    forM_ args $ \filePath -> do
        cssMap <- parseCssFile filePath
        putStrLn $ "CSS properties for file: " ++ filePath
        print cssMap
