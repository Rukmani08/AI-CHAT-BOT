
import {TypeAnimation} from 'react-type-animation'

const TypingAnime = () => {
  return (
    <TypeAnimation
     sequence={[
    // Same substring at the start will only be typed once, initially
    'Chat with Your OWN AI',
    1000,
    'Built with OpenAI',
    1000,
    'Your Own Customized ChatGPT',
    1000,
  ]}
  speed={50}
  style={{ fontSize: '60px', color:"white", display:"inline-block", textShadow:"1px 1px 20px #000" }}
  repeat={Infinity}
/>
  )
}

export default TypingAnime
