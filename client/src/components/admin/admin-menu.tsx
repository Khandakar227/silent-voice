"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const getMenuItemClass = (path: string) => {
    return pathname === path
      ? "block py-1 px-3 mb-2 bg-[#9fdaf0] rounded-sm transition-colors"
      : "block py-1 px-3 mb-2 hover:bg-[#9fdaf0] rounded-sm transition-colors"
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuButtonVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  }

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  }

  const menuItemVariants = {
    open: { opacity: 1, x: 0, delay: 0.6 },
    closed: { opacity: 0, x: "100%", delay: 0.2 },
  }

  return (
    <div>
      <motion.button
        className={`${
          isMenuOpen ? "top-[4.5rem] right-8" : "top-20 right-10"
        } bg-[#9fdaf0] p-[0.3rem] fixed rounded-md`}
        onClick={toggleMenu}
        variants={menuButtonVariants}
        animate={isMenuOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
      >
        {isMenuOpen ? (
          <Cross1Icon color='black' />
        ) : (
          <motion.div
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 },
            }}
            animate={isMenuOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          >
            <HamburgerMenuIcon color='black' />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.section
            className='bg-[#eaf2f5] p-3 fixed right-12 top-24 rounded-sm shadow-lg z-50'
            variants={menuVariants}
            initial='closed'
            animate='open'
            exit='closed'
          >
            <motion.ul
              className='list-none mt-2'
              variants={menuItemVariants}
              initial='closed'
              animate='open'
              exit='closed'
            >
              <motion.li variants={menuItemVariants}>
                <Link className={getMenuItemClass("/admin")} href='/admin'>
                  Admin Dashboard
                </Link>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <Link
                  className={getMenuItemClass("/admin/dictionary")}
                  href='/admin/dictionary'
                >
                  Dictionary
                </Link>
              </motion.li>
            </motion.ul>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminMenu
