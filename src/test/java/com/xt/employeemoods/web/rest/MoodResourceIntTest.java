package com.xt.employeemoods.web.rest;

import com.xt.employeemoods.MoodsApp;

import com.xt.employeemoods.domain.Mood;
import com.xt.employeemoods.repository.MoodRepository;
import com.xt.employeemoods.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MoodResource REST controller.
 *
 * @see MoodResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MoodsApp.class)
public class MoodResourceIntTest {

    private static final String DEFAULT_MOOD = "AAAAAAAAAA";
    private static final String UPDATED_MOOD = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_OFFICE = "AAAAAAAAAA";
    private static final String UPDATED_OFFICE = "BBBBBBBBBB";

    @Autowired
    private MoodRepository moodRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMoodMockMvc;

    private Mood mood;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MoodResource moodResource = new MoodResource(moodRepository);
        this.restMoodMockMvc = MockMvcBuilders.standaloneSetup(moodResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mood createEntity(EntityManager em) {
        Mood mood = new Mood()
            .mood(DEFAULT_MOOD)
            .date(DEFAULT_DATE)
            .office(DEFAULT_OFFICE);
        return mood;
    }

    @Before
    public void initTest() {
        mood = createEntity(em);
    }

    @Test
    @Transactional
    public void createMood() throws Exception {
        int databaseSizeBeforeCreate = moodRepository.findAll().size();

        // Create the Mood
        restMoodMockMvc.perform(post("/api/moods")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isCreated());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeCreate + 1);
        Mood testMood = moodList.get(moodList.size() - 1);
        assertThat(testMood.getMood()).isEqualTo(DEFAULT_MOOD);
        assertThat(testMood.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMood.getOffice()).isEqualTo(DEFAULT_OFFICE);
    }

    @Test
    @Transactional
    public void createMoodWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = moodRepository.findAll().size();

        // Create the Mood with an existing ID
        mood.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoodMockMvc.perform(post("/api/moods")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isBadRequest());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMoods() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        // Get all the moodList
        restMoodMockMvc.perform(get("/api/moods?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mood.getId().intValue())))
            .andExpect(jsonPath("$.[*].mood").value(hasItem(DEFAULT_MOOD.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].office").value(hasItem(DEFAULT_OFFICE.toString())));
    }

    @Test
    @Transactional
    public void getMood() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);

        // Get the mood
        restMoodMockMvc.perform(get("/api/moods/{id}", mood.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(mood.getId().intValue()))
            .andExpect(jsonPath("$.mood").value(DEFAULT_MOOD.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.office").value(DEFAULT_OFFICE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMood() throws Exception {
        // Get the mood
        restMoodMockMvc.perform(get("/api/moods/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMood() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();

        // Update the mood
        Mood updatedMood = moodRepository.findOne(mood.getId());
        updatedMood
            .mood(UPDATED_MOOD)
            .date(UPDATED_DATE)
            .office(UPDATED_OFFICE);

        restMoodMockMvc.perform(put("/api/moods")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMood)))
            .andExpect(status().isOk());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate);
        Mood testMood = moodList.get(moodList.size() - 1);
        assertThat(testMood.getMood()).isEqualTo(UPDATED_MOOD);
        assertThat(testMood.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMood.getOffice()).isEqualTo(UPDATED_OFFICE);
    }

    @Test
    @Transactional
    public void updateNonExistingMood() throws Exception {
        int databaseSizeBeforeUpdate = moodRepository.findAll().size();

        // Create the Mood

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMoodMockMvc.perform(put("/api/moods")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mood)))
            .andExpect(status().isCreated());

        // Validate the Mood in the database
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMood() throws Exception {
        // Initialize the database
        moodRepository.saveAndFlush(mood);
        int databaseSizeBeforeDelete = moodRepository.findAll().size();

        // Get the mood
        restMoodMockMvc.perform(delete("/api/moods/{id}", mood.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Mood> moodList = moodRepository.findAll();
        assertThat(moodList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mood.class);
        Mood mood1 = new Mood();
        mood1.setId(1L);
        Mood mood2 = new Mood();
        mood2.setId(mood1.getId());
        assertThat(mood1).isEqualTo(mood2);
        mood2.setId(2L);
        assertThat(mood1).isNotEqualTo(mood2);
        mood1.setId(null);
        assertThat(mood1).isNotEqualTo(mood2);
    }
}
