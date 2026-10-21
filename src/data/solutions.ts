export interface Solution {
  id: string;
  title: string;
  whatIsIt: string;
  whoNeedsIt: string;
  whatCanYouDo: string;
  howWeProvide: string;
}

export const solutions: Solution[] = [
  {
    id: 'live-tv-channel',
    title: 'Live TV Channel',
    whatIsIt: 'A comprehensive 24x7 broadcasting setup that allows you to schedule, playout, and transmit live and pre-recorded video content continuously.',
    whoNeedsIt: 'News agencies, religious organizations, educational institutions, entertainment networks, and local community channels.',
    whatCanYouDo: 'Run a fully automated 24/7 TV channel with scheduled programming, live news inserts, scrolling tickers, and commercial breaks.',
    howWeProvide: 'We provide robust playout servers, streaming infrastructure, scheduling software, and necessary bandwidth to ensure uninterrupted broadcast globally.'
  },
  {
    id: 'multi-platform-streaming',
    title: 'Multi-Platform Streaming',
    whatIsIt: 'A solution that takes a single video feed and simultaneously broadcasts it across multiple platforms like YouTube, Facebook, Twitch, and your own website.',
    whoNeedsIt: 'Content creators, event organizers, digital marketers, and broadcasters looking to maximize their audience reach.',
    whatCanYouDo: 'Reach audiences wherever they are without needing multiple encoders or excessive local internet bandwidth.',
    howWeProvide: 'Our cloud servers receive your single high-quality feed and use our high-speed network to distribute it to all selected platforms instantly.'
  },
  {
    id: 'ott',
    title: 'OTT (Over-The-Top) Platform',
    whatIsIt: 'A dedicated video-on-demand and live streaming platform delivered directly over the internet, bypassing traditional cable or satellite providers.',
    whoNeedsIt: 'Film studios, independent filmmakers, religious bodies, and businesses wanting their own "Netflix-like" platform.',
    whatCanYouDo: 'Monetize content via subscriptions (SVOD), ads (AVOD), or pay-per-view (TVOD). Offer a branded experience on web, mobile, and smart TVs.',
    howWeProvide: 'We offer white-label OTT applications, secure video hosting, content delivery networks (CDN), and payment gateway integration.'
  },
  {
    id: 'iptv',
    title: 'IPTV (Internet Protocol Television)',
    whatIsIt: 'The delivery of television content over IP networks. It provides a continuous stream of video content managed through a private or public network.',
    whoNeedsIt: 'ISPs, cable operators, hotels, hospitals, and residential complexes.',
    whatCanYouDo: 'Provide a structured channel lineup, catch-up TV, and interactive TV services directly to set-top boxes or smart TVs.',
    howWeProvide: 'We supply the IPTV middleware, transcoding servers, set-top box integration, and content management systems required for a seamless viewer experience.'
  },
  {
    id: 'professional-playout',
    title: 'Professional Playout',
    whatIsIt: 'Advanced software and hardware used to sequence video files, live feeds, and graphics into a single continuous broadcast stream.',
    whoNeedsIt: 'Professional TV channels, local cable operators, and corporate media rooms.',
    whatCanYouDo: 'Add dynamic graphics, lower thirds, automated playlists, and seamless transitions between programs and commercials.',
    howWeProvide: 'We provide high-end playout software, rendering hardware, and training to ensure you can manage a broadcast-grade television output.'
  },
  {
    id: 'automated-streaming',
    title: 'Automated Streaming',
    whatIsIt: 'A system that allows you to upload videos and schedule them to stream "as live" at specific times without requiring manual intervention.',
    whoNeedsIt: 'Churches, educators, digital marketers, and anyone wanting to replay past events as live broadcasts.',
    whatCanYouDo: 'Simulate a live event experience, complete with live chat on social platforms, even while you are sleeping.',
    howWeProvide: 'We provide cloud-based scheduling tools where you upload your MP4 files, set a calendar, and our servers handle the "live" push automatically.'
  },
  {
    id: 're-streaming',
    title: 'Re-Streaming',
    whatIsIt: 'A service that pulls a live feed from an existing source (like an IP camera or another server) and restream it to new destinations.',
    whoNeedsIt: 'Broadcasters receiving third-party feeds, event aggregators, and remote production teams.',
    whatCanYouDo: 'Take a feed from a remote location with low bandwidth, bring it into a high-capacity cloud server, and distribute it to thousands of viewers.',
    howWeProvide: 'Our servers act as a powerful bridge, pulling the source stream and utilizing our massive backbone bandwidth to push it wherever needed.'
  },
  {
    id: 'srt-streaming',
    title: 'SRT (Secure Reliable Transport) Streaming',
    whatIsIt: 'An open-source video transport protocol that optimizes streaming performance across unpredictable networks like the public internet.',
    whoNeedsIt: 'Outside broadcast units, news reporters, remote event producers, and contribution links between studios.',
    whatCanYouDo: 'Deliver high-quality, secure, and low-latency video over unreliable internet connections without packet loss or stuttering.',
    howWeProvide: 'We deploy dedicated SRT listener/caller servers capable of handling secure point-to-point or point-to-multipoint high-quality video transfer.'
  },
  {
    id: 'rtsp-streaming',
    title: 'RTSP (Real-Time Streaming Protocol)',
    whatIsIt: 'A network control protocol designed for use in entertainment and communications systems to control streaming media servers.',
    whoNeedsIt: 'Security companies, traffic monitoring, wildlife observation, and smart city infrastructure.',
    whatCanYouDo: 'Pull and manage live video feeds from standard IP cameras globally and embed them into central monitoring dashboards or public websites.',
    howWeProvide: 'We provide RTSP ingest servers that convert camera feeds into universally playable formats like HLS for web and mobile viewing.'
  },
  {
    id: 'low-latency-streaming',
    title: 'Low-Latency Streaming',
    whatIsIt: 'Video streaming technology optimized to reduce the delay between the live action and the viewer seeing it to sub-second or 1-2 second levels.',
    whoNeedsIt: 'Live auctions, sports betting, interactive webinars, gaming, and telemedicine.',
    whatCanYouDo: 'Interact with your audience in real-time without the awkward 15-30 second delay common in traditional streaming.',
    howWeProvide: 'We utilize WebRTC and optimized CMAF/HLS delivery networks to guarantee ultra-fast video delivery to end-user devices.'
  },
  {
    id: 'radio-streaming',
    title: 'Radio Streaming',
    whatIsIt: 'An internet-based audio broadcasting solution to run a live 24/7 radio station globally.',
    whoNeedsIt: 'FM/AM stations expanding online, independent podcasters, music curators, and religious ministries.',
    whatCanYouDo: 'Broadcast live talk shows, schedule automated music playlists, and reach listeners in cars, on mobile phones, and smart speakers.',
    howWeProvide: 'We provide Icecast/Shoutcast servers, AutoDJ scheduling tools, bandwidth, and custom mobile apps for your listeners.'
  },
  {
    id: 'mobile-broadcasting',
    title: 'Mobile Broadcasting',
    whatIsIt: 'A solution designed to stream live video directly from smartphones or deliver optimized video to mobile audiences.',
    whoNeedsIt: 'Citizen journalists, vloggers, field reporters, and organizations wanting to reach a mobile-first audience.',
    whatCanYouDo: 'Go live from anywhere using just a smartphone, or ensure your viewers have a native app experience on iOS and Android.',
    howWeProvide: 'We offer mobile encoder apps for contribution and build custom-branded iOS/Android viewing apps for your audience.'
  },
  {
    id: 'multi-camera-production',
    title: 'Multi-Camera Production',
    whatIsIt: 'A setup involving multiple cameras and a video switcher to create dynamic, professional live event coverage.',
    whoNeedsIt: 'Concert organizers, mega-churches, sports arenas, and large-scale corporate event producers.',
    whatCanYouDo: 'Switch between different camera angles, add instant replays, overlay graphics, and create TV-quality live productions.',
    howWeProvide: 'We provide software switchers (like vMix), encoding hardware, remote production cloud instances, and the delivery network to broadcast the final mix.'
  },
  {
    id: 'local-tv-distribution',
    title: 'Local TV Distribution',
    whatIsIt: 'Technology to distribute a television channel feed directly to local cable operators (MSOs) or broadcast receivers.',
    whoNeedsIt: 'Regional news channels, local entertainment networks, and community television stations.',
    whatCanYouDo: 'Deliver your 24/7 channel in pristine quality to cable headends without expensive satellite uplink costs.',
    howWeProvide: 'We supply cloud distribution servers and physical broadcast receiver boxes for local MSOs to pull your channel securely via the internet.'
  },
  {
    id: 'private-video-network',
    title: 'Private Video Network',
    whatIsIt: 'A highly secure, closed-loop video delivery system restricted to authorized viewers only.',
    whoNeedsIt: 'Corporations (for internal town halls), government agencies, military, and premium educational platforms.',
    whatCanYouDo: 'Share sensitive live streams or training videos with absolute certainty that unauthorized users cannot access or leak the content.',
    howWeProvide: 'We deploy encrypted streaming protocols, token-based authentication, DRM (Digital Rights Management), and geo-blocking to lock down your content.'
  }
];
