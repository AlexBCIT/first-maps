// this will route to :     /api/locationsOfInterest

import dbConnect from "../../../utils/dbConnect"
import LocationOfInterest from '../../../models/LocationOfInterest'

import { getLanguageData } from '../../../helpers/getLanguageData'

dbConnect();


// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {   
    const { method } = req;    

    switch (method) {
        case 'GET':
            try {
                // find all locationsOfInterest
                const locationsOfInterest = await LocationOfInterest.find({})

                // below is the code for lazy loading of language data if it doesn't exist in the database
                // but it won't be triggered because we have the same logic in the post route
                let places = []
                for (let i = 0; i < locationsOfInterest.length; i++) {
                    places.push({
                        name: locationsOfInterest[i].name,
                        description: locationsOfInterest[i].description,
                        category: locationsOfInterest[i].category,
                        coordinates: locationsOfInterest[i].coordinates
                    })

                    if (locationsOfInterest[i].languages.length === 0) {
                        console.log('languages absent, requesting from native-land.ca')
                        const [lng, lat] = locationsOfInterest[i].coordinates
                        const languageData = await getLanguageData(lat, lng)

                        places[i].languages = languageData.length === 0 ? 
                            []
                            : 
                            languageData.map(language => {
                                return {
                                    id: language.properties.ID, // just in case we need it later?
                                    name: language.properties.Name.replace(/&#8217;/g,"'"), // replace html apostrophe symbols with real apostrophes
                                    link: language.properties.description // just in case we need it later?
                                }
                            })

                        // then we do something like
                        await LocationOfInterest.findByIdAndUpdate(locationsOfInterest[i]._id, places[i])

                        // also, we could check for each language in the database and save it if it doesn't exist
                    }
                }

                res.status(200).json({ success: true, results: locationsOfInterest })

            } catch(error){
                res.status(400).json({ "error message" : error.toString() })
            }
            break;

        case 'POST':
            try {
                // get the native language data
                const [lng, lat] = req.body.coordinates
                const languageData = await getLanguageData(lat, lng)

                const location = {...req.body}
                // add array of languages to location object
                location.languages = languageData.map(language => {
                    return {
                        id: language.properties.ID, // just in case we need it later?
                        name: language.properties.Name.replace(/&#8217;/g,"'"), // replace html apostrophe symbols with real apostrophes
                        link: language.properties.description // just in case we need it later?
                    }
                })
                
                const locationOfInterest = await LocationOfInterest.create(location)
                res.status(201).json({ success: true, results: locationOfInterest })
            } catch(error){
                res.status(400).json({ "error message": error.toString() })
            }
            break;

        default:
            res.status(400).json({ success: false, message: "This route does not exist" })
    }
}
