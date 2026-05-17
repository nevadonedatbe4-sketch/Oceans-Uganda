import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import LogoLoading from '@/components/base/LogoLoading';
import { supabase } from '@/lib/supabase';
import { NbHistorySEO } from '@/components/feature/PageSEO';

function fromSlug(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Rich history data per neighbourhood ──────────────────────────────────────
interface HistoryData {
  era: string;
  founded: string;
  origin: string;
  history: { period: string; text: string }[];
  character: string;
  architecture: string;
  community: string;
  notableFor: string[];
  gallery: { url: string; caption: string }[];
  funFact: string;
}

const HISTORY: Record<string, HistoryData> = {
  kololo: {
    era: 'Colonial Era · 1900s',
    founded: 'Early 1900s',
    origin: 'Named after the Kololo people, a Sotho-speaking group from southern Africa who briefly ruled the Lozi kingdom. The hill was chosen by British colonial administrators for its commanding elevation and cool breezes.',
    history: [
      { period: '1900–1940', text: 'Kololo Hill was designated as the European residential quarter during British colonial rule. Its elevation — the highest point in Kampala — made it naturally cooler and strategically significant. The first colonial bungalows and administrative residences were built here, surrounded by manicured gardens.' },
      { period: '1940–1962', text: 'As Uganda moved toward independence, Kololo became home to the Governor\'s Lodge and senior colonial officials. Wide, tree-lined avenues were laid out, and the neighbourhood took on its distinctive character of spacious plots and elegant architecture.' },
      { period: '1962–1990', text: 'After independence, Kololo transitioned into the diplomatic quarter. Foreign embassies, high commissions, and international organisations established their missions here, drawn by the security, prestige, and infrastructure already in place.' },
      { period: '1990–Present', text: 'Today, Kololo remains Kampala\'s most prestigious address. It is home to over 30 foreign embassies, the Kampala Golf Club, and some of Uganda\'s most exclusive private residences. Property values here are among the highest in East Africa.' },
    ],
    character: 'Kololo exudes quiet authority. Wide, canopied avenues, high perimeter walls, and the occasional glimpse of a manicured garden define its streetscape. It is calm, secure, and unmistakably elite — a neighbourhood where the city\'s noise feels very far away.',
    architecture: 'A blend of colonial-era bungalows, mid-century modernist villas, and contemporary luxury homes. Many properties sit on large plots with mature tropical gardens. The architectural language is restrained and elegant — no garish facades, just quality materials and considered design.',
    community: 'Kololo\'s community is international and professional. Diplomats, NGO directors, senior executives, and Uganda\'s business elite call it home. The social scene revolves around private clubs, embassy functions, and a handful of excellent restaurants.',
    notableFor: ['Kampala Golf Club', 'Foreign Embassies Row', 'Highest elevation in Kampala', 'Governor\'s Lodge (now State House Annex)', 'Kololo Airstrip (historic)'],
    gallery: [
      { url: 'https://readdy.ai/api/search-image?query=Kololo%20Kampala%20Uganda%20colonial%20era%20tree%20lined%20avenue%20wide%20road%20lush%20tropical%20canopy%20elegant%20residential%20street%20warm%20golden%20afternoon%20light%20heritage%20architecture%20photography&width=800&height=500&seq=kololo_hist_1&orientation=landscape', caption: 'The iconic tree-lined avenues of Kololo' },
      { url: 'https://readdy.ai/api/search-image?query=Kololo%20Kampala%20Uganda%20luxury%20villa%20colonial%20bungalow%20style%20white%20walls%20manicured%20tropical%20garden%20high%20perimeter%20wall%20elegant%20residential%20property%20photography&width=800&height=500&seq=kololo_hist_2&orientation=landscape', caption: 'Colonial-era architecture preserved in Kololo' },
      { url: 'https://readdy.ai/api/search-image?query=Kampala%20Golf%20Club%20Uganda%20lush%20green%20fairway%20tropical%20trees%20rolling%20hills%20panoramic%20view%20golfers%20playing%20warm%20sunny%20day%20aerial%20photography&width=800&height=500&seq=kololo_hist_3&orientation=landscape', caption: 'Kampala Golf Club — a Kololo landmark since 1906' },
    ],
    funFact: 'Kololo Hill was used as a military observation post during World War I. Its elevation gave a clear line of sight across the entire Kampala basin.',
  },
  muyenga: {
    era: 'Post-Colonial · 1960s',
    founded: 'Mid 1960s',
    origin: 'Muyenga takes its name from the Luganda word for a type of fig tree that once grew abundantly on the hill. The area was developed as a residential suburb in the years following Ugandan independence.',
    history: [
      { period: '1960–1975', text: 'Following independence, Muyenga was developed as a middle-to-upper-class residential suburb. Its hilltop position with views of Lake Victoria made it immediately attractive to Kampala\'s growing professional class.' },
      { period: '1975–1990', text: 'During the turbulent Amin and Obote years, Muyenga\'s relative isolation and strong community ties helped it maintain stability. Many of the original families who settled here in the 1960s remained through this period.' },
      { period: '1990–2005', text: 'With Uganda\'s economic recovery under Museveni, Muyenga saw significant investment. International NGOs and development organisations established offices in Kampala, and their expatriate staff gravitated toward Muyenga for its views, safety, and community feel.' },
      { period: '2005–Present', text: 'Muyenga is now firmly established as Kampala\'s expat heartland. A thriving café and restaurant scene has developed, and the neighbourhood hosts a diverse, international community. Property values have risen steadily, driven by consistent demand from the diplomatic and NGO community.' },
    ],
    character: 'Muyenga has the feel of a village within a city. Narrow, winding roads climb the hill past bougainvillea-draped walls and glimpses of the lake below. There\'s a relaxed, almost Mediterranean quality to life here — unhurried, social, and deeply pleasant.',
    architecture: 'A mix of 1960s bungalows, 1990s townhouses, and modern apartment blocks. Many properties have been renovated and extended over the decades. The defining feature is the view — almost every home on the upper slopes has a Lake Victoria panorama.',
    community: 'Muyenga\'s community is one of Kampala\'s most international. Expats from across Europe, North America, and Asia live alongside Ugandan professionals and business owners. The Tank Hill area is particularly popular, with several well-regarded restaurants and a lively social scene.',
    notableFor: ['Tank Hill panoramic viewpoint', 'Lake Victoria views', 'Expat community hub', 'Muyenga Bar & Grill', 'Proximity to Ggaba Road dining strip'],
    gallery: [
      { url: 'https://readdy.ai/api/search-image?query=Muyenga%20Kampala%20Uganda%20hilltop%20panoramic%20view%20Lake%20Victoria%20shimmering%20water%20lush%20green%20valley%20tropical%20trees%20golden%20dusk%20light%20scenic%20residential%20photography&width=800&height=500&seq=muyenga_hist_1&orientation=landscape', caption: 'Lake Victoria views from Tank Hill, Muyenga' },
      { url: 'https://readdy.ai/api/search-image?query=Muyenga%20Kampala%20Uganda%20winding%20residential%20street%20bougainvillea%20walls%20tropical%20garden%20lush%20green%20expat%20neighbourhood%20warm%20afternoon%20light%20photography&width=800&height=500&seq=muyenga_hist_2&orientation=landscape', caption: 'The winding streets of Muyenga' },
      { url: 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20expat%20neighbourhood%20outdoor%20restaurant%20terrace%20tropical%20garden%20warm%20evening%20light%20social%20dining%20scene%20lush%20greenery%20photography&width=800&height=500&seq=muyenga_hist_3&orientation=landscape', caption: 'Muyenga\'s thriving café and restaurant scene' },
    ],
    funFact: 'The "Tank Hill" area of Muyenga gets its name from the large water storage tanks that were installed there in the 1960s to supply the growing suburb. The tanks are long gone, but the name — and the views — remain.',
  },
  nakasero: {
    era: 'Colonial Era · 1890s',
    founded: 'Late 1890s',
    origin: 'Nakasero is one of Kampala\'s oldest hills, settled by the British in the 1890s as the administrative centre of the Uganda Protectorate. The name derives from the Luganda word for a type of grass that once covered the hill.',
    history: [
      { period: '1890–1920', text: 'Nakasero was chosen by Frederick Lugard and the British East Africa Company as the site for the first permanent administrative buildings in Kampala. The hill\'s central position and commanding views made it the natural choice for the colonial capital.' },
      { period: '1920–1962', text: 'Nakasero developed into the commercial and administrative heart of Kampala. The main post office, government offices, and the first hotels were built here. Nakasero Market — still operating today — was established in this era and became the city\'s primary food market.' },
      { period: '1962–2000', text: 'After independence, Nakasero retained its status as Kampala\'s central business district. The first high-rise buildings appeared in the 1970s and 1980s, transforming the skyline. The area became increasingly mixed-use, with offices, hotels, and upscale apartments.' },
      { period: '2000–Present', text: 'Nakasero today is Kampala\'s most central and prestigious business address. The Serena Hotel, Kampala\'s finest, anchors the neighbourhood. New luxury apartment towers have risen alongside colonial-era buildings, creating a layered, dynamic urban environment.' },
    ],
    character: 'Nakasero is the beating heart of Kampala — busy, cosmopolitan, and full of energy. It\'s where business gets done, where the best hotels are, and where the city\'s social elite gather. Yet it retains pockets of calm: shaded gardens, quiet side streets, and the occasional colonial building that has survived the decades.',
    architecture: 'Nakasero\'s architecture tells the story of Kampala\'s development. Colonial-era buildings sit alongside 1970s modernist blocks and contemporary glass towers. The Serena Hotel, the Uganda Museum, and several government buildings are architectural landmarks.',
    community: 'Nakasero\'s community is professional and transient. Business executives, government officials, hotel guests, and diplomats pass through daily. The permanent residential community is smaller but affluent, drawn by the convenience of being at the centre of everything.',
    notableFor: ['Serena Hotel Kampala', 'Nakasero Market (est. 1920s)', 'Uganda Museum', 'Parliament of Uganda (nearby)', 'Kampala\'s first commercial district'],
    gallery: [
      { url: 'https://readdy.ai/api/search-image?query=Nakasero%20Hill%20Kampala%20Uganda%20central%20business%20district%20modern%20office%20towers%20colonial%20buildings%20mixed%20skyline%20aerial%20view%20warm%20sunset%20amber%20glow%20urban%20panorama%20photography&width=800&height=500&seq=nakasero_hist_1&orientation=landscape', caption: 'Nakasero\'s layered skyline — old and new' },
      { url: 'https://readdy.ai/api/search-image?query=Nakasero%20Market%20Kampala%20Uganda%20historic%20outdoor%20market%20vibrant%20colourful%20produce%20vendors%20busy%20urban%20scene%20tropical%20city%20photography&width=800&height=500&seq=nakasero_hist_2&orientation=landscape', caption: 'Nakasero Market — a Kampala institution since the 1920s' },
      { url: 'https://readdy.ai/api/search-image?query=Serena%20Hotel%20Kampala%20Uganda%20luxury%20hotel%20exterior%20elegant%20architecture%20tropical%20gardens%20manicured%20grounds%20prestigious%20hospitality%20photography&width=800&height=500&seq=nakasero_hist_3&orientation=landscape', caption: 'The Serena Hotel — Nakasero\'s landmark address' },
    ],
    funFact: 'Nakasero Hill was the site of the first telegraph station in Uganda, established in 1901, connecting Kampala to Mombasa and the wider British Empire.',
  },
  bugolobi: {
    era: 'Post-Independence · 1970s',
    founded: 'Early 1970s',
    origin: 'Bugolobi was developed as a planned residential suburb in the early 1970s, designed to house Kampala\'s growing middle class. Its name comes from the Luganda language, though its exact etymology is debated among local historians.',
    history: [
      { period: '1970–1985', text: 'Bugolobi was laid out as a planned suburb with wide roads, regular plot sizes, and a mix of residential and light commercial uses. The Uganda Electricity Board and other parastatal organisations built staff housing here, giving the area a stable, professional character from the outset.' },
      { period: '1985–2000', text: 'As Kampala recovered from the instability of the 1970s and 80s, Bugolobi emerged as one of the city\'s most desirable middle-class addresses. Its proximity to Nakasero and good road connections made it popular with professionals.' },
      { period: '2000–2015', text: 'The 2000s saw Bugolobi transform dramatically. Old bungalows were replaced by modern apartment blocks, and a vibrant dining and café scene emerged along the main roads. The neighbourhood became known as one of Kampala\'s most walkable and liveable areas.' },
      { period: '2015–Present', text: 'Today, Bugolobi is one of Kampala\'s most sought-after urban neighbourhoods. Modern apartment complexes, excellent restaurants, and a young, professional community have made it the city\'s answer to a contemporary urban village.' },
    ],
    character: 'Bugolobi has a youthful, urban energy that sets it apart from Kampala\'s older, more established neighbourhoods. It\'s walkable, social, and constantly evolving. The dining scene is arguably the best in the city, and the apartment stock is among the most modern.',
    architecture: 'Bugolobi\'s architecture is predominantly modern — apartment blocks from the 2000s and 2010s, with some older bungalows surviving on quieter streets. The buildings are functional and well-maintained, if not architecturally dramatic.',
    community: 'Young professionals, couples, and small families dominate Bugolobi\'s community. There\'s a strong expat presence, particularly from the NGO and tech sectors. The neighbourhood has a social, outward-looking character — people here tend to eat out, socialise, and engage with the city.',
    notableFor: ['Bugolobi Village Mall', 'Kampala\'s best restaurant strip', 'Modern apartment living', 'Proximity to Nakasero CBD', 'Young professional community'],
    gallery: [
      { url: 'https://readdy.ai/api/search-image?query=Bugolobi%20Kampala%20Uganda%20modern%20apartment%20complex%20contemporary%20architecture%20wide%20clean%20street%20tropical%20trees%20residential%20neighbourhood%20bright%20daytime%20photography&width=800&height=500&seq=bugolobi_hist_1&orientation=landscape', caption: 'Modern apartment living in Bugolobi' },
      { url: 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20urban%20restaurant%20outdoor%20terrace%20modern%20design%20young%20professionals%20dining%20tropical%20city%20neighbourhood%20evening%20warm%20light%20photography&width=800&height=500&seq=bugolobi_hist_2&orientation=landscape', caption: 'Bugolobi\'s thriving restaurant scene' },
      { url: 'https://readdy.ai/api/search-image?query=Bugolobi%20Kampala%20Uganda%20walkable%20urban%20street%20wide%20pavement%20tropical%20trees%20modern%20buildings%20pedestrians%20daytime%20city%20life%20photography&width=800&height=500&seq=bugolobi_hist_3&orientation=landscape', caption: 'Bugolobi — one of Kampala\'s most walkable neighbourhoods' },
    ],
    funFact: 'Bugolobi was one of the first neighbourhoods in Kampala to have a dedicated jogging track — a reflection of its health-conscious, active community.',
  },
  naguru: {
    era: 'Colonial Era · 1930s',
    founded: 'Late 1930s',
    origin: 'Naguru Hill was developed in the late colonial period as a residential area for senior African civil servants — a deliberate policy to create a class of educated, professional Ugandans who would eventually take over the administration of the country.',
    history: [
      { period: '1935–1962', text: 'Naguru was developed by the colonial administration as housing for senior African government employees. This was a significant policy shift — acknowledging that Ugandans would eventually govern themselves. The housing was of high quality, with large plots and solid construction.' },
      { period: '1962–1980', text: 'After independence, Naguru became home to Uganda\'s emerging professional class — doctors, lawyers, academics, and civil servants. The neighbourhood developed a strong sense of community and civic pride that persists to this day.' },
      { period: '1980–2000', text: 'Naguru\'s panoramic views and quiet streets attracted increasing interest from Kampala\'s growing business community. The Naguru-Ntinda area developed as a significant residential corridor, with new housing estates complementing the original colonial-era homes.' },
      { period: '2000–Present', text: 'Today, Naguru is prized for its views, its quiet character, and its large plot sizes — increasingly rare in a city where land is at a premium. Families and professionals who want space without sacrificing city access consistently choose Naguru.' },
    ],
    character: 'Naguru has a settled, established quality that comes from decades of stable, professional community life. It\'s quieter than most Kampala neighbourhoods, with wide roads, mature trees, and a sense of space that feels increasingly precious in the growing city.',
    architecture: 'Naguru\'s housing stock ranges from original colonial-era bungalows to 1970s family homes and modern villas. The plots are generous, and many homes have been extended and renovated over the decades. The overall character is residential and spacious.',
    community: 'Naguru\'s community is predominantly Ugandan — professional families, academics, and established business people. There\'s a strong sense of neighbourhood identity, with long-standing residents who have lived here for decades.',
    notableFor: ['Panoramic views over Kampala', 'Naguru Hospital (major medical centre)', 'Large residential plots', 'Quiet, established community', 'Proximity to Ntinda commercial area'],
    gallery: [
      { url: 'https://readdy.ai/api/search-image?query=Naguru%20Kampala%20Uganda%20hilltop%20panoramic%20view%20rolling%20green%20hills%20dense%20tropical%20vegetation%20luxury%20villas%20rooftops%20dramatic%20sky%20residential%20photography&width=800&height=500&seq=naguru_hist_1&orientation=landscape', caption: 'Naguru\'s famous panoramic views over Kampala' },
      { url: 'https://readdy.ai/api/search-image?query=Naguru%20Kampala%20Uganda%20quiet%20residential%20street%20mature%20tropical%20trees%20wide%20road%20family%20homes%20established%20neighbourhood%20warm%20afternoon%20light%20photography&width=800&height=500&seq=naguru_hist_2&orientation=landscape', caption: 'The quiet, established streets of Naguru' },
      { url: 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20colonial%20era%20bungalow%20residential%20home%20large%20garden%20mature%20trees%20established%20neighbourhood%20warm%20light%20heritage%20architecture%20photography&width=800&height=500&seq=naguru_hist_3&orientation=landscape', caption: 'Colonial-era homes preserved in Naguru' },
    ],
    funFact: 'Naguru was home to the first African-owned law firm in Uganda, established in the 1960s by one of the neighbourhood\'s early residents — a reflection of its professional, pioneering community.',
  },
  munyonyo: {
    era: 'Royal History · Pre-Colonial',
    founded: 'Pre-Colonial Era',
    origin: 'Munyonyo has one of the most significant histories of any Kampala neighbourhood. It was the site of the Buganda Kingdom\'s royal landing on Lake Victoria, and later became famous as the location where the first Christian missionaries arrived in Uganda.',
    history: [
      { period: 'Pre-1875', text: 'Munyonyo was a royal landing site for the Buganda Kingdom, used by the Kabaka (king) and his court to access Lake Victoria. The shoreline was considered sacred, and the area was reserved for royal use.' },
      { period: '1875–1900', text: 'In 1875, Henry Morton Stanley arrived at Munyonyo by canoe, becoming one of the first Europeans to visit the Buganda Kingdom. His meeting with Kabaka Mutesa I at Munyonyo is one of the most significant moments in Ugandan history, leading directly to the arrival of Christian missionaries.' },
      { period: '1900–1960', text: 'Under British colonial rule, Munyonyo\'s lakeside position made it a site for boat building and fishing. The area remained relatively undeveloped compared to the hilltop neighbourhoods, preserving its natural character.' },
      { period: '1960–Present', text: 'Post-independence, Munyonyo was developed as an exclusive residential and hospitality area. The Munyonyo Commonwealth Resort — built for the 2007 Commonwealth Heads of Government Meeting — transformed the neighbourhood into one of Kampala\'s most prestigious addresses.' },
    ],
    character: 'Munyonyo has a unique quality — part resort, part exclusive suburb, part historical site. The lake is ever-present, the air is fresher than the city, and the pace of life is noticeably slower. It feels like a retreat from Kampala, even though it\'s only 20 minutes from the centre.',
    architecture: 'Munyonyo\'s architecture ranges from the grand Munyonyo Commonwealth Resort to exclusive gated estates and private villas. Many properties have direct lake access or lake views. The overall character is luxurious and private.',
    community: 'Munyonyo\'s community is small, exclusive, and international. Senior diplomats, business leaders, and wealthy Ugandans choose Munyonyo for its privacy, its lake access, and its resort-like atmosphere.',
    notableFor: ['Munyonyo Commonwealth Resort', 'Stanley\'s 1875 landing site', 'Lake Victoria waterfront access', 'Exclusive gated estates', 'Historical significance to Ugandan Christianity'],
    gallery: [
      { url: 'https://readdy.ai/api/search-image?query=Munyonyo%20Kampala%20Uganda%20lakeside%20luxury%20resort%20Lake%20Victoria%20shoreline%20lush%20green%20slopes%20premium%20homes%20tropical%20paradise%20aerial%20photography&width=800&height=500&seq=munyonyo_hist_1&orientation=landscape', caption: 'Munyonyo\'s lakeside setting on Lake Victoria' },
      { url: 'https://readdy.ai/api/search-image?query=Munyonyo%20Commonwealth%20Resort%20Kampala%20Uganda%20luxury%20hotel%20exterior%20elegant%20architecture%20tropical%20gardens%20Lake%20Victoria%20view%20prestigious%20photography&width=800&height=500&seq=munyonyo_hist_2&orientation=landscape', caption: 'The Munyonyo Commonwealth Resort' },
      { url: 'https://readdy.ai/api/search-image?query=Lake%20Victoria%20Uganda%20shoreline%20historic%20landing%20site%20lush%20tropical%20vegetation%20calm%20water%20reflections%20golden%20hour%20light%20scenic%20photography&width=800&height=500&seq=munyonyo_hist_3&orientation=landscape', caption: 'The historic Munyonyo shoreline where Stanley landed in 1875' },
    ],
    funFact: 'Henry Morton Stanley\'s 1875 letter to the Daily Telegraph, written after his visit to Munyonyo, prompted the Church Missionary Society to send missionaries to Uganda — directly leading to the Christianisation of the country.',
  },
};

const DEFAULT_HISTORY: HistoryData = {
  era: 'Established Neighbourhood',
  founded: 'Mid 20th Century',
  origin: 'An established Kampala neighbourhood with a rich community history and strong residential character.',
  history: [
    { period: '1950–1980', text: 'The neighbourhood developed as part of Kampala\'s post-war expansion, attracting families and professionals seeking quality residential living within reach of the city centre.' },
    { period: '1980–2000', text: 'Through Uganda\'s period of recovery and growth, the neighbourhood maintained its residential character, with a stable community of long-term residents.' },
    { period: '2000–Present', text: 'Today, the neighbourhood continues to attract families and professionals, with ongoing investment in housing and infrastructure reflecting its enduring appeal.' },
  ],
  character: 'A well-established Kampala neighbourhood with a strong sense of community, good infrastructure, and easy access to the city\'s amenities.',
  architecture: 'A mix of residential property types reflecting the neighbourhood\'s development over several decades, from original family homes to modern developments.',
  community: 'A diverse, established community of Ugandan families, professionals, and long-term residents who value the neighbourhood\'s stability and character.',
  notableFor: ['Established residential community', 'Good road access', 'Proximity to Kampala CBD', 'Growing property market'],
  gallery: [
    { url: 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20established%20residential%20neighbourhood%20wide%20tree%20lined%20street%20family%20homes%20tropical%20garden%20lush%20green%20warm%20afternoon%20light%20photography&width=800&height=500&seq=default_hist_1&orientation=landscape', caption: 'Residential streets of Kampala' },
    { url: 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20luxury%20residential%20neighbourhood%20aerial%20view%20lush%20tropical%20greenery%20premium%20gated%20community%20homes%20scenic%20wide%20roads%20sunny%20day%20photography&width=800&height=500&seq=default_hist_2&orientation=landscape', caption: 'Kampala\'s residential landscape' },
  ],
  funFact: 'Kampala is built on seven hills — a fact that gives each neighbourhood its own distinct character, views, and microclimate.',
};

function getHistory(slug: string): HistoryData {
  const key = Object.keys(HISTORY).find((k) => slug.toLowerCase().includes(k));
  return key ? HISTORY[key] : DEFAULT_HISTORY;
}

const FALLBACK_HERO: Record<string, string> = {
  kololo: 'https://readdy.ai/api/search-image?query=Kololo%20Kampala%20Uganda%20dramatic%20aerial%20skyline%20panorama%20hilltop%20neighbourhood%20elevated%20city%20view%20dense%20tropical%20canopy%20luxury%20rooftops%20golden%20hour%20light%20sweeping%20urban%20landscape%20photography&width=1400&height=600&seq=kololo_hist_hero&orientation=landscape',
  muyenga: 'https://readdy.ai/api/search-image?query=Muyenga%20Kampala%20Uganda%20scenic%20hilltop%20panorama%20Lake%20Victoria%20shimmering%20water%20visible%20background%20lush%20green%20valley%20luxury%20rooftops%20tropical%20trees%20golden%20dusk%20light%20dramatic%20wide%20angle%20photography&width=1400&height=600&seq=muyenga_hist_hero&orientation=landscape',
  nakasero: 'https://readdy.ai/api/search-image?query=Nakasero%20Hill%20Kampala%20Uganda%20city%20skyline%20aerial%20view%20central%20business%20district%20modern%20office%20towers%20mixed%20high%20rise%20buildings%20dense%20urban%20core%20sunset%20warm%20amber%20glow%20panoramic%20cityscape%20photography&width=1400&height=600&seq=nakasero_hist_hero&orientation=landscape',
  bugolobi: 'https://readdy.ai/api/search-image?query=Bugolobi%20Kampala%20Uganda%20modern%20urban%20skyline%20aerial%20view%20contemporary%20apartment%20blocks%20mixed%20residential%20commercial%20buildings%20wide%20organized%20streets%20tropical%20tree%20lined%20avenues%20bright%20daytime%20photography&width=1400&height=600&seq=bugolobi_hist_hero&orientation=landscape',
  naguru: 'https://readdy.ai/api/search-image?query=Naguru%20Kampala%20Uganda%20hilltop%20panoramic%20skyline%20aerial%20sweeping%20view%20over%20Kampala%20city%20rolling%20green%20hills%20dense%20tropical%20vegetation%20luxury%20villas%20rooftops%20peaking%20through%20canopy%20dramatic%20sky%20photography&width=1400&height=600&seq=naguru_hist_hero&orientation=landscape',
  munyonyo: 'https://readdy.ai/api/search-image?query=Munyonyo%20Kampala%20Uganda%20lakeside%20skyline%20aerial%20view%20Lake%20Victoria%20shoreline%20premium%20residential%20area%20lush%20green%20slopes%20luxury%20homes%20descending%20toward%20shimmering%20lake%20water%20dramatic%20aerial%20landscape%20photography&width=1400&height=600&seq=munyonyo_hist_hero&orientation=landscape',
};

function getFallbackHero(slug: string): string {
  const key = Object.keys(FALLBACK_HERO).find((k) => slug.toLowerCase().includes(k));
  return key
    ? FALLBACK_HERO[key]
    : 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20luxury%20residential%20neighbourhood%20aerial%20view%20lush%20tropical%20greenery%20premium%20gated%20community%20homes%20scenic%20wide%20roads%20sunny%20day%20photography&width=1400&height=600&seq=nb-hist-hero-fallback&orientation=landscape';
}

interface DbNeighborhood {
  id: string;
  name: string;
  slug: string;
  hero_image: string | null;
  long_description: string | null;
  highlights: string[] | null;
  lifestyle_tags: string[] | null;
}

export default function NbHistoryPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const name = fromSlug(slug);
  const history = getHistory(slug);

  const [neighborhood, setNeighborhood] = useState<DbNeighborhood | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('neighborhoods')
        .select('id, name, slug, hero_image, long_description, highlights, lifestyle_tags')
        .or(`slug.ilike.${slug},name.ilike.${name}`)
        .maybeSingle();
      setNeighborhood(data ?? null);
      setLoading(false);
    }
    load();
  }, [slug, name]);

  const displayName = neighborhood?.name || name;
  const heroImage = neighborhood?.hero_image || getFallbackHero(slug);
  const dbHighlights: string[] = neighborhood?.highlights ?? [];
  const allHighlights = dbHighlights.length > 0 ? dbHighlights : history.notableFor;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LogoLoading label="Loading history…" size={64} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NbHistorySEO name={displayName} slug={slug} />
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative w-full" style={{ minHeight: '520px' }}>
        <img
          src={heroImage}
          alt={displayName}
          className="w-full h-full object-cover object-top absolute inset-0"
          style={{ minHeight: '520px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-primary/20" />

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 pt-28 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-2 text-white/60 text-xs font-roboto flex-wrap">
              <Link to="/" className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">Home</Link>
              <i className="ri-arrow-right-s-line" />
              <Link to="/neighbourhoods" className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">Neighbourhoods</Link>
              <i className="ri-arrow-right-s-line" />
              <Link to={`/neighbourhood/${slug}`} className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">{displayName}</Link>
              <i className="ri-arrow-right-s-line" />
              <span className="text-white/90">History &amp; Character</span>
            </nav>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-48 pb-16">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-golden/20 border border-golden/40 text-golden text-[10px] font-roboto font-bold uppercase tracking-[0.25em] rounded-sm mb-5 whitespace-nowrap">
              {history.era}
            </span>
            <h1 className="font-prata text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
              {displayName}
            </h1>
            <p className="text-white/70 font-roboto text-base leading-relaxed mb-6 max-w-xl">
              History, character &amp; community — everything you need to know about living in {displayName}.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to={`/neighbourhood/${slug}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-golden text-primary text-xs font-roboto font-semibold uppercase tracking-widest rounded hover:bg-golden/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-building-2-line" />
                View Listings
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/40 text-white text-xs font-roboto uppercase tracking-widest rounded hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-chat-1-line" />
                Talk to an Agent
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick facts bar ── */}
      <div className="bg-[#f5f5f5] border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-full">
              <i className="ri-calendar-line text-golden text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-roboto text-stone-400 uppercase tracking-wider">Founded</p>
              <p className="text-sm font-roboto font-semibold text-primary">{history.founded}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-stone-200 hidden md:block" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-full">
              <i className="ri-map-pin-2-line text-golden text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-roboto text-stone-400 uppercase tracking-wider">Location</p>
              <p className="text-sm font-roboto font-semibold text-primary">Kampala, Uganda</p>
            </div>
          </div>
          <div className="w-px h-8 bg-stone-200 hidden md:block" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-full">
              <i className="ri-history-line text-golden text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-roboto text-stone-400 uppercase tracking-wider">Era</p>
              <p className="text-sm font-roboto font-semibold text-primary">{history.era}</p>
            </div>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2">
            <Link
              to={`/neighbourhood/${slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-roboto uppercase tracking-widest rounded hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-building-2-line text-xs" />
              See Listings
            </Link>
          </div>
        </div>
      </div>

      {/* ── Origin story ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3">
            <p className="text-[11px] font-roboto font-bold uppercase tracking-widest text-golden mb-3">The Story</p>
            <h2 className="font-prata text-primary text-2xl md:text-3xl mb-5">How {displayName} Came to Be</h2>
            <p className="text-stone-600 font-roboto text-sm leading-relaxed mb-6">{history.origin}</p>
            <p className="text-stone-600 font-roboto text-sm leading-relaxed">{history.character}</p>
          </div>
          <div className="lg:col-span-2">
            {/* Fun fact card */}
            <div className="bg-primary rounded-xl p-6 mb-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center bg-golden/20 rounded-full shrink-0">
                  <i className="ri-lightbulb-line text-golden text-sm" />
                </div>
                <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-golden pt-1.5">Did You Know?</p>
              </div>
              <p className="text-white/85 font-roboto text-sm leading-relaxed">{history.funFact}</p>
            </div>

            {/* Notable for */}
            <div className="bg-[#f5f5f5] rounded-xl p-5 border border-stone-100">
              <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-3">Notable For</p>
              <ul className="space-y-2">
                {allHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ri-star-fill text-golden text-xs" />
                    </div>
                    <span className="text-stone-600 font-roboto text-xs leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-[#f5f5f5] border-t border-stone-100 py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-roboto font-bold uppercase tracking-widest text-golden mb-3">Through the Years</p>
          <h2 className="font-prata text-primary text-2xl md:text-3xl mb-10">A History of {displayName}</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2 hidden md:block" />

            <div className="space-y-8 md:space-y-0">
              {history.history.map((item, idx) => (
                <div
                  key={item.period}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} mb-8`}
                >
                  {/* Content */}
                  <div className={`md:w-5/12 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className={`bg-white rounded-xl p-6 border border-stone-100 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                      <span className="inline-block px-3 py-1 bg-golden/10 text-golden text-[10px] font-roboto font-bold uppercase tracking-wider rounded-sm mb-3 whitespace-nowrap">
                        {item.period}
                      </span>
                      <p className="text-stone-600 font-roboto text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>

                  {/* Centre dot */}
                  <div className="hidden md:flex md:w-2/12 items-start justify-center pt-6">
                    <div className="w-4 h-4 rounded-full bg-golden border-4 border-white ring-2 ring-golden/30 shrink-0" />
                  </div>

                  {/* Spacer */}
                  <div className="md:w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      {history.gallery.length > 0 && (
        <section className="py-16 px-6 md:px-10 bg-white">
          <div className="max-w-6xl mx-auto">
            <p className="text-[11px] font-roboto font-bold uppercase tracking-widest text-golden mb-3">Gallery</p>
            <h2 className="font-prata text-primary text-2xl md:text-3xl mb-8">{displayName} in Pictures</h2>

            {/* Main image */}
            <div className="relative overflow-hidden rounded-xl mb-4" style={{ height: '420px' }}>
              <img
                src={history.gallery[activeGallery].url}
                alt={history.gallery[activeGallery].caption}
                className="w-full h-full object-cover object-top transition-opacity duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white font-roboto text-sm">{history.gallery[activeGallery].caption}</p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {history.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGallery(idx)}
                  className={`relative overflow-hidden rounded-lg flex-1 cursor-pointer transition-all ${activeGallery === idx ? 'ring-2 ring-golden' : 'opacity-60 hover:opacity-100'}`}
                  style={{ height: '80px' }}
                >
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Architecture & Community ── */}
      <section className="bg-[#f5f5f5] border-t border-stone-100 py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-golden/10 rounded-full">
                <i className="ri-building-4-line text-golden text-lg" />
              </div>
              <div>
                <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400">Architecture</p>
                <h3 className="font-prata text-primary text-lg">Built Environment</h3>
              </div>
            </div>
            <p className="text-stone-600 font-roboto text-sm leading-relaxed">{history.architecture}</p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-golden/10 rounded-full">
                <i className="ri-group-line text-golden text-lg" />
              </div>
              <div>
                <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400">Community</p>
                <h3 className="font-prata text-primary text-lg">Who Lives Here</h3>
              </div>
            </div>
            <p className="text-stone-600 font-roboto text-sm leading-relaxed">{history.community}</p>
          </div>
        </div>
      </section>

      {/* ── CTA — View Listings ── */}
      <section className="py-16 px-6 md:px-10 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 md:p-12">
                <p className="text-golden text-[10px] font-roboto font-bold uppercase tracking-widest mb-3">Ready to Move?</p>
                <h2 className="font-prata text-white text-2xl md:text-3xl mb-4">Find Your Home in {displayName}</h2>
                <p className="text-white/70 font-roboto text-sm leading-relaxed mb-7">
                  Browse available properties in {displayName} — from luxury villas to modern apartments. Our agents know every street.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/neighbourhood/${slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-golden text-primary text-xs font-roboto font-semibold uppercase tracking-widest rounded hover:bg-golden/90 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-building-2-line" />
                    View All Listings
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white text-xs font-roboto uppercase tracking-widest rounded hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-chat-1-line" />
                    Speak to an Agent
                  </Link>
                </div>
              </div>
              <div
                className="hidden md:block relative overflow-hidden"
                style={{ minHeight: '280px' }}
              >
                <img
                  src={heroImage}
                  alt={displayName}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Back to neighbourhood ── */}
      <div className="border-t border-stone-100 py-6 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Link
            to={`/neighbourhood/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-roboto text-stone-500 hover:text-primary transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line" />
            Back to {displayName} Listings
          </Link>
          <Link
            to="/neighbourhoods"
            className="inline-flex items-center gap-2 text-sm font-roboto text-stone-500 hover:text-primary transition-colors cursor-pointer"
          >
            All Neighbourhoods
            <i className="ri-arrow-right-line" />
          </Link>
        </div>
      </div>

      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
