import { Router } from 'express';
import PuppeteerScraper from '../../../context/Scrapper/PuppeteerScraper';
import RecordRepository from '../../../context/Record/RecordRepository';
import UserRepository from '../../../context/User/UserRepository';
import { isUserLoggedIn } from '../../../middlewares/auth/isUserLoggedIn';

const streamRouter = Router();
const scraper = new PuppeteerScraper();

// retrieve all recordings from the user
streamRouter.get('/', isUserLoggedIn, async (req, res) => {
  // TODO: get all recordings for the logged in user
  try {
    const userId = req.userId as string;
    const userRepository = new UserRepository();
    const user = await userRepository.findUserById(userId);
    const repository = new RecordRepository();
    const userRecordings = await repository.getRecordsFromUser(user?.id);
    res.status(200).json({ data: userRecordings });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// TODO: program a new recording for a given date

streamRouter.post('/', async (req, res) => {
  const { url } = req.body;
  try {
    await scraper.streamScreen(url);
    res.status(201).json({ message: 'video file created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default streamRouter;
