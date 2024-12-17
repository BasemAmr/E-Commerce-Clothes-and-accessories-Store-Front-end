'use client';

import { motion } from "framer-motion";
import React from "react";

const Transition: React.FC = () => {
  return (
      <motion.div
        className="flex items-center justify-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce"></div>
      </motion.div>
  );
};

export default Transition;