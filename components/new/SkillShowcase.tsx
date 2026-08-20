'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './SkillsShowcase.module.css';

interface Skill {
  id: number;
  title: string;
  description: string;
  icon?: string;
  level?: string;
}

interface SkillsShowcaseProps {
  imageSrc: string;
  imageAlt: string;
  skills: Skill[];
  title?: string;
  subtitle?: string;
}

export const SkillsShowcase: React.FC<SkillsShowcaseProps> = ({
  imageSrc,
  imageAlt,
  skills,
  title,
  subtitle,
}) => {
  const [activeSkill, setActiveSkill] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;

      // Find which skill is currently in view
      skillRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const relativePosition = (center - containerTop) / containerHeight;

        if (relativePosition >= 0 && relativePosition <= 1) {
          setActiveSkill(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Left side - Sticky Image */}
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={styles.image}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {title && (
            <div className={styles.imageOverlay}>
              <h2 className={styles.imageTitle}>{title}</h2>
              {subtitle && <p className={styles.imageSubtitle}>{subtitle}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Right side - Scrollable Skills */}
      <div className={styles.skillsWrapper}>
        <div className={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              ref={(el) => {
                skillRefs.current[index] = el;
              }}
              className={`${styles.skillCard} ${
                activeSkill === index ? styles.skillCardActive : ''
              }`}
            >
              <div className={styles.skillHeader}>
                {skill.icon && (
                  <span className={styles.skillIcon}>{skill.icon}</span>
                )}
                <h3 className={styles.skillTitle}>{skill.title}</h3>
                {skill.level && (
                  <span className={styles.skillLevel}>{skill.level}</span>
                )}
              </div>
              <p className={styles.skillDescription}>{skill.description}</p>
              {skill.level && (
                <div className={styles.skillProgress}>
                  <div
                    className={styles.skillProgressBar}
                    style={{ width: skill.level }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};