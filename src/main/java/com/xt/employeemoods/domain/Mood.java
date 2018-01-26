package com.xt.employeemoods.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Mood.
 */
@Entity
@Table(name = "mood")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Mood implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "mood")
    private String mood;

    @Column(name = "jhi_date")
    private LocalDate date;

    @Column(name = "office")
    private String office;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMood() {
        return mood;
    }

    public Mood mood(String mood) {
        this.mood = mood;
        return this;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public LocalDate getDate() {
        return date;
    }

    public Mood date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getOffice() {
        return office;
    }

    public Mood office(String office) {
        this.office = office;
        return this;
    }

    public void setOffice(String office) {
        this.office = office;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Mood mood = (Mood) o;
        if (mood.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), mood.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Mood{" +
            "id=" + getId() +
            ", mood='" + getMood() + "'" +
            ", date='" + getDate() + "'" +
            ", office='" + getOffice() + "'" +
            "}";
    }
}
