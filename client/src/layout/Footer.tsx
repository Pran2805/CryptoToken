import { Globe } from 'lucide-react'
import { FiGithub, FiHeart, FiMail, FiShield, FiStar, FiTrendingUp, FiZap } from 'react-icons/fi'

function Footer() {
    return (
        <footer className="mt-12 text-center py-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <a href="https://github.com/pran2805/" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <FiGithub size={20} />
                    </a>
                    <a href="https://pranav-shinde.vercel.app/" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <Globe size={20} />
                    </a>
                    <a
                        href="mailto:pranavshinde.as@gmail.com"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <FiMail size={20} />
                    </a>
                </div>
                <p className="text-gray-800 font-semibold">
                    DSurv Crypto Token - College Project by Pranav Shinde
                </p>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <FiHeart className="text-red-500 animate-pulse" />
                    Blockchain with Proof of Work
                    <FiStar className="text-yellow-500" />
                    Cosmos Integration
                </p>
                <div className="flex gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <FiShield /> Secure
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <FiZap /> Fast
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <FiTrendingUp /> Scalable
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
